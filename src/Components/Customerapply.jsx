import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa"; // Import document icon
import jwtDecode from "jwt-decode"; // Import jwt-decode

const VerifyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get the token from localStorage or sessionStorage
    const token = localStorage.getItem("token"); // Adjust storage as per your setup

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.user_id); // Assuming user_id is in the token
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3000/documents/list`)
        .then((response) => {
          const allDocuments = response.data.documents;
          const filteredDocs = allDocuments.filter((doc) => doc.user_id === userId);
          setDocuments(filteredDocs);
        })
        .catch((error) => console.error("Error fetching documents:", error));

      axios
        .get("http://localhost:3000/certificates")
        .then((response) => setCertificates(response.data))
        .catch((error) => console.error("Error fetching certificates:", error));
    }
  }, [userId]);

  const getCertificateByDocumentId = (documentId) => {
    const matchedCertificate = certificates.find((cert) => cert.document_id === documentId);
    return matchedCertificate ? matchedCertificate.certificate_id : null;
  };

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
    <div className="flex h-screen">
      {/* Sidebar Component */}
      <div className="w-[250px] flex-shrink-0">  {/* Sidebar should not shrink */}
        {/* <Sidebar /> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-hidden overflow-x-auto">
        <div className="w-full bg-white p-6">
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-2xl font-bold">Applications</h1>
          </div>

          {/* Scrollable Table Container */}
          <div className="w-full ">
            <table className="w-full min-w-[1200px] border-collapse border border-gray-300">
              <thead className="bg-gray-300">
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
                  <th className="border p-3">Document Fields</th>
                  <th className="border p-3">Documents</th>
                  <th className="border p-3">Verification</th>
                  <th className="border p-3">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
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
                      {Object.entries(doc.document_fields).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {String(value)}
                        </div>
                      ))}
                    </td>
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
          onClick={(e) => {
            e.preventDefault();
            window.open(file.file_path, "_blank", "width=800,height=600");
          }}
        >
          <FaFileAlt className="text-blue-500 text-xl" />
        </a>
      ))}
  </div>
</td>

                    <td className="border p-2 ">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm flex justify-center ${doc.status === "Approved"
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
          </div> {/* End of Scrollable Table Container */}
        </div>
      </div>
    </div>
  );
};

export default VerifyDocuments;
