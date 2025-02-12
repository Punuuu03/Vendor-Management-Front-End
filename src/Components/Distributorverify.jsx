// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";

const VerifyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch documents
  useEffect(() => {
    axios
      .get("http://localhost:3000/documents/list")
      .then((response) => setDocuments(response.data.documents))
      .catch((error) => console.error("Error fetching documents:", error));
  }, []);

  // Update document status
  const handleUpdateStatus = async (documentId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/documents/update-status/${documentId}`, { status: newStatus });
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.document_id === documentId ? { ...doc, status: newStatus } : doc
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  // Upload certificate
  const handleUploadCertificate = async (documentId) => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const selectedDocument = documents.find((doc) => doc.document_id === documentId);
    if (!selectedDocument) {
      alert("Document not found");
      return;
    }

    const { user_id, distributor_id } = selectedDocument;

    if (!user_id || !distributor_id) {
      alert("User ID or Distributor ID is missing");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("document_id", documentId.toString());
    formData.append("user_id", user_id.toString());
    formData.append("distributor_id", distributor_id.toString());

    try {
      await axios.post("http://localhost:3000/certificates/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Certificate uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading certificate:", error);
      alert(`Failed to upload certificate: ${error.response?.data?.message || "Internal server error"}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Verify Documents</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg border">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Subcategory</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Documents</th>
              <th className="p-3 text-left">Verification</th>
              <th className="p-3 text-left">Actions</th>
              <th className="p-3 text-left">Upload Certificate</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.document_id} className="border-b">
                <td className="p-3">{doc.category_name}</td>
                <td className="p-3">{doc.subcategory_name}</td>
                <td className="p-3">{doc.name}</td>
                <td className="p-3">{doc.email}</td>
                <td className="p-3">{doc.phone}</td>
                <td className="p-3">{doc.address}</td>
                <td className="p-3">
                  {doc.documents.map((file, index) => (
                    <div key={index}>
                      <a href={file.file_path} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        View Document
                      </a>
                    </div>
                  ))}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-white rounded-full ${
                      doc.status === "Processing"
                        ? "bg-purple-500"
                        : doc.status === "Rejected"
                        ? "bg-red-500"
                        : doc.status === "Uploaded"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {doc.status}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => handleUpdateStatus(doc.document_id, "Processing")} className="bg-purple-500 text-white px-3 py-1 rounded mr-2">
                    Processing
                  </button>
                  <button onClick={() => handleUpdateStatus(doc.document_id, "Rejected")} className="bg-red-500 text-white px-3 py-1 rounded">
                    Reject
                  </button>
                  <button onClick={() => handleUpdateStatus(doc.document_id, "Uploaded")} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                    Uploaded
                  </button>
                </td>
                <td className="p-3">
                  {doc.status === "Uploaded" && (
                    <div>
                      <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="mb-2 border p-2 rounded" />
                      <button onClick={() => handleUploadCertificate(doc.document_id)} className="bg-blue-500 text-white px-3 py-1 rounded">
                        Upload
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerifyDocuments;
