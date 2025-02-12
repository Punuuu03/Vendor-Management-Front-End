import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa"; // Import document icon

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
    <div className="w-full bg-gray-100 p-6">
      <div className="w-full bg-white p-6">
      <div className="flex justify-center items-center mb-4">
  <h1 className="text-2xl font-bold">Applications</h1>
</div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-300 sticky top-0">
            <tr>
              <th className="border p-3">S.No</th>
              <th className="border p-3">User ID</th>
              <th className="border p-3">Document ID</th>
              <th className="border p-3">Category</th>
              <th className="border p-3">Subcategory</th>
              <th className="border p-3">Name</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Phone</th>
              <th className="border p-3">Address</th>
              <th className="border p-3">Documents</th>
              <th className="border p-3">Verification</th>
              <th className="border p-3">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc, index) => (
              <tr key={doc.document_id} className="border-t hover:bg-gray-100">
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2 text-center">{doc.user_id}</td>
                <td className="border p-2 text-center">{doc.document_id}</td>
                <td className="border p-2">{doc.category_name}</td>
                <td className="border p-2">{doc.subcategory_name}</td>
                <td className="border p-2">{doc.name}</td>
                <td className="border p-2">{doc.email}</td>
                <td className="border p-2">{doc.phone}</td>
                <td className="border p-2">{doc.address}</td>
                <td className="border p-2">
                  <div className="flex justify-center">
                    {doc.documents &&
                      doc.documents.map((file, index) => (
                        <a
                          key={index}
                          href={file.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          <FaFileAlt className="text-blue-500 text-xl" />
                        </a>
                      ))}
                  </div>
                </td>
                <td className="border p-2 ">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm flex justify-center ${
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
                <td className="p-3 flex justify-center">
                  {doc.status === "Completed" && getCertificateByDocumentId(doc.document_id) ? (
                    <button
                      onClick={() => handleViewCertificate(doc.document_id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-gray-500 text-center">Not Available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default VerifyDocuments;
