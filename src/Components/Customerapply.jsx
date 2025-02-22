import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";
import jwtDecode from "jwt-decode";

const VerifyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.user_id);
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
          const filteredDocs = allDocuments
            .filter((doc) => doc.user_id === userId)
            .reverse(); // Show newest first
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
    const matchedCertificate = certificates.find(
      (cert) => cert.document_id === documentId
    );
    return matchedCertificate ? matchedCertificate.certificate_id : null;
  };

  const handleViewCertificate = async (documentId) => {
    const certificateId = getCertificateByDocumentId(documentId);
    if (!certificateId) {
      alert("Certificate not found.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/certificates/${certificateId}`
      );

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

  // Search and Filter Logic
  const filteredDocuments = documents.filter((doc) => {
    const searchString = `${doc.user_id} ${doc.document_id} ${doc.category_name} ${doc.subcategory_name} ${doc.name} ${doc.email} ${doc.phone} ${doc.address}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const statusMatch = statusFilter
      ? doc.status.toLowerCase() === statusFilter.toLowerCase()
      : true;

    return searchString && statusMatch;
  });

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[310px] flex-shrink-0">{/* <Sidebar /> */}</div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 mt-5 overflow-hidden">
        <div className="w-full bg-white p-6">
          {/* Header with Search and Filter */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Applications</h1>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
                <option value="Uploaded">Uploaded</option>
              </select>
            </div>
          </div>

          {/* Table Container with Scroll */}
          <div className="w-full max-h-[75vh] overflow-y-auto border border-gray-300">
            <table className="w-full min-w-[1200px] border-collapse">
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
                      {Object.entries(doc.document_fields).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {String(value)}
                        </div>
                      ))}
                    </td>
                    <td className="border p-2">
                      <div className="flex justify-center">
                        {doc.documents &&
                          doc.documents.map((file, idx) => (
                            <a
                              key={idx}
                              href={file.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
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
                    <td className="border p-2">
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
                      {doc.status === "Completed" &&
                      getCertificateByDocumentId(doc.document_id) ? (
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
                {filteredDocuments.length === 0 && (
                  <tr>
                    <td colSpan="13" className="text-center py-4">
                      No documents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyDocuments;
