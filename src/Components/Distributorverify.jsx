// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa"; // Import document icon
import {jwtDecode} from "jwt-decode"; // Import jwt-decode

const VerifyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [distributorId, setDistributorId] = useState(null);

  // Decode token and fetch user_id as distributor_id
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        setDistributorId(userId);
        fetchDocuments(userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch documents based on distributor_id
  const fetchDocuments = async (distributorId) => {
    try {
      const response = await axios.get(`http://localhost:3000/documents/list/${distributorId}`);
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

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

    const { user_id } = selectedDocument;

    if (!user_id || !distributorId) {
      alert("User ID or Distributor ID is missing");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("document_id", documentId.toString());
    formData.append("user_id", user_id.toString());
    formData.append("distributor_id", distributorId.toString());

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
    <div className="container max-w-6xl bg-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Verify Documents</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-300 sticky top-0">
            <tr>
              {["Document Id", "Category", "Subcategory", "Name", "Email", "Phone", "Address", "Documents", "Verification", "Actions", "Upload Certificate"].map((header, index) => (
                <th key={index} className="border p-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={doc.document_id} className={`border-t hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <td className="border p-2 text-center">{doc.document_id}</td>
                <td className="border p-2">{doc.category_name}</td>
                <td className="border p-2">{doc.subcategory_name}</td>
                <td className="border p-2">{doc.name}</td>
                <td className="border p-2">{doc.email}</td>
                <td className="border p-2">{doc.phone}</td>
                <td className="border p-2">{doc.address}</td>
                <td className="border p-2 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    {doc.documents.map((file, index) => (
                      <a key={index} href={file.file_path} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        <FaFileAlt className="text-blue-500 text-xl" />
                      </a>
                    ))}
                  </div>
                </td>
                <td className="border p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      doc.status === "Processing"
                        ? "bg-orange-500"
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
                <td className="p-4 flex flex-col items-center space-y-2">
                  <button onClick={() => handleUpdateStatus(doc.document_id, "Processing")} className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition">
                    Processing
                  </button>
                  <button onClick={() => handleUpdateStatus(doc.document_id, "Rejected")} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                    Reject
                  </button>
                  <button onClick={() => handleUpdateStatus(doc.document_id, "Uploaded")} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                    Uploaded
                  </button>
                </td>
                <td className="border p-2">
                  {doc.status === "Uploaded" && (
                    <div className="flex flex-col items-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="mb-2 border p-2 rounded text-sm w-40"
                      />
                      <button
                        onClick={() => handleUploadCertificate(doc.document_id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      >
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
