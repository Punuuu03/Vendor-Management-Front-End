import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa"; // Document icon
import jwtDecode from "jwt-decode"; // JWT decoder
import Swal from "sweetalert2"; // Popup notifications

const VerifyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [distributorId, setDistributorId] = useState(null);

  // Decode token and extract user ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id || decodedToken.id || decodedToken.user;
        if (userId) {
          setDistributorId(userId);
          fetchDocuments(userId);
        } else {
          console.error("User ID is missing in the decoded token.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("Token is missing.");
    }
  }, []);

  // Fetch documents by distributor ID
  const fetchDocuments = async (distributorId) => {
    try {
      const response = await axios.get(`https://vm.q1prh3wrjc0aw.ap-south-1.cs.amazonlightsail.com/documents/list/${distributorId}`);
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Update document status
  const handleUpdateStatus = async (documentId, newStatus) => {
    try {
      await axios.put(`https://vm.q1prh3wrjc0aw.ap-south-1.cs.amazonlightsail.com/documents/update-status/${documentId}`, { status: newStatus });
      setDocuments((prev) =>
        prev.map((doc) => (doc.document_id === documentId ? { ...doc, status: newStatus } : doc))
      );
      Swal.fire("Success", `Status updated to ${newStatus}`, "success");
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // Upload certificate file
  const handleUploadCertificate = async (documentId) => {
    if (!selectedFile) {
      Swal.fire("Warning", "Please select a file first", "warning");
      return;
    }

    const selectedDocument = documents.find((doc) => doc.document_id === documentId);
    if (!selectedDocument) {
      Swal.fire("Error", "Document not found", "error");
      return;
    }

    const { user_id } = selectedDocument;
    const finalUserId = user_id || distributorId;

    if (!finalUserId || !distributorId) {
      Swal.fire("Error", "User ID or Distributor ID is missing", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("document_id", documentId.toString());
    formData.append("user_id", finalUserId.toString());
    formData.append("distributor_id", distributorId.toString());

    try {
      await axios.post("https://vm.q1prh3wrjc0aw.ap-south-1.cs.amazonlightsail.com/certificates/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDocuments((prev) =>
        prev.map((doc) => (doc.document_id === documentId ? { ...doc, status: "Uploaded" } : doc))
      );

      Swal.fire("Success", "Certificate uploaded successfully!", "success");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading certificate:", error);
      Swal.fire("Error", error.response?.data?.message || "Internal server error", "error");
    }
  };

  return (
    <div className="ml-[300px] flex flex-col items-center min-h-screen p-10 bg-gray-100">
      <div className="w-full p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Manage Disributor List </h2>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-300">
            <tr>
              {["Document Id", "Category", "Subcategory", "Name", "Email", "Phone", "Address", "Documents", "Verification", "Actions", "Upload Certificate"].map((header, index) => (
                <th key={index} className="border p-2 text-center">{header}</th>
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
                <td className="border p-2 text-center">
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${doc.status === "Processing"
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
                  <button onClick={() => handleUpdateStatus(doc.document_id, "Rejected")} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                    Reject
                  </button>
                  <button onClick={() => handleUpdateStatus(doc.document_id, "Uploaded")} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                    Uploaded
                  </button>
                </td>
                <td className="border p-2">
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
