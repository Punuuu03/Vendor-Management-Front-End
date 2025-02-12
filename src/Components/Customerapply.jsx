import React, { useEffect, useState } from "react";
import axios from "axios";

const VerifyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Fetch users, documents, and certificates
  useEffect(() => {
    axios
      .get("http://localhost:3000/users/register")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching registered users:", error));

    axios
      .get("http://localhost:3000/documents/list")
      .then((response) => setDocuments(response.data.documents))
      .catch((error) => console.error("Error fetching documents:", error));

    axios
      .get("http://localhost:3000/certificates")
      .then((response) => setCertificates(response.data))
      .catch((error) => console.error("Error fetching certificates:", error));
  }, []);

  // Filter documents based on matching user_id from registration
  const filteredDocuments = documents.filter((doc) =>
    users.some((user) => user.user_id === doc.user_id)
  );

  // Get matching certificate_id based on document_id
  const getCertificateByDocumentId = (documentId) => {
    const matchedCertificate = certificates.find(
      (cert) => cert.document_id === documentId
    );
    return matchedCertificate ? matchedCertificate.certificate_id : null;
  };

  // Open certificate in a new window
  const handleViewCertificate = async (documentId) => {
    const certificateId = getCertificateByDocumentId(documentId);
    if (!certificateId) {
      alert("Certificate not found.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/certificates/${certificateId}`);

      if (response.data && response.data.file_url) {
        window.open(response.data.file_url, "_blank");
      } else {
        alert("Certificate not found.");
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
      alert("Failed to fetch certificate.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Verify Documents</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg border">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Document ID</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Subcategory</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Documents</th>
              <th className="p-3 text-left">Verification</th>
              <th className="p-3 text-left">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc) => (
              <tr key={doc.document_id} className="border-b">
                <td className="p-3">{doc.user_id}</td>
                <td className="p-3">{doc.document_id}</td>
                <td className="p-3">{doc.category_name}</td>
                <td className="p-3">{doc.subcategory_name}</td>
                <td className="p-3">{doc.name}</td>
                <td className="p-3">{doc.email}</td>
                <td className="p-3">{doc.phone}</td>
                <td className="p-3">{doc.address}</td>
                <td className="p-3">
                  {doc.documents &&
                    doc.documents.map((file, index) => (
                      <div key={index}>
                        <a
                          href={file.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View Document
                        </a>
                      </div>
                    ))}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-white rounded-full ${
                      doc.status === "Approved"
                        ? "bg-green-500"
                        : doc.status === "Rejected"
                        ? "bg-red-500"
                        : doc.status === "Completed"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {doc.status}
                  </span>
                </td>
                <td className="p-3">
                  {doc.status === "Completed" && getCertificateByDocumentId(doc.document_id) ? (
                    <button
                      onClick={() => handleViewCertificate(doc.document_id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-gray-500">Not Available</span>
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
