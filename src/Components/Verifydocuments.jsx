// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";

const VerifyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Fetch documents, distributors, and certificates
  useEffect(() => {
    axios
      .get("http://localhost:3000/documents/list")
      .then((response) => {
        setDocuments(response.data.documents);
      })
      .catch((error) => console.error("Error fetching documents:", error));

    axios
      .get("http://localhost:3000/users/distributors")
      .then((response) => setDistributors(response.data))
      .catch((error) => console.error("Error fetching distributors:", error));

    axios
      .get("http://localhost:3000/certificates")
      .then((response) => {
        setCertificates(response.data);
      })
      .catch((error) => console.error("Error fetching certificates:", error));
  }, []);

  // Update document status
  const handleUpdateStatus = async (documentId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/documents/update-status/${documentId}`, {
        status: newStatus,
      });

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

  // Assign distributor
  const handleAssignDistributor = async (documentId, distributorId) => {
    if (!distributorId) return;
    try {
      await axios.put(`http://localhost:3000/documents/assign-distributor/${documentId}`, {
        distributor_id: distributorId,
      });

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.document_id === documentId ? { ...doc, distributor_id: distributorId } : doc
        )
      );

      alert("Distributor assigned successfully!");
    } catch (error) {
      console.error("Error assigning distributor:", error);
      alert("Failed to assign distributor.");
    }
  };

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
              <th className="p-3 text-left">Document ID</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Subcategory</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Documents</th>
              <th className="p-3 text-left">Verification</th>
              <th className="p-3 text-left">Actions</th>
              <th className="p-3 text-left">Assign Distributor</th>
              <th className="p-3 text-left">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.document_id} className="border-b">
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
                  <button
                    onClick={() => handleUpdateStatus(doc.document_id, "Approved")}
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(doc.document_id, "Rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(doc.document_id, "Completed")}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Completed
                  </button>
                </td>
                <td className="p-3">
                  {["Approved", "Completed", "Uploaded", "Processing"].includes(doc.status) ? (
                    <select
                      className="border p-2 rounded"
                      onChange={(e) => handleAssignDistributor(doc.document_id, e.target.value)}
                      value={doc.distributor_id || ""}
                    >
                      <option value="">Select Distributor</option>
                      {distributors.map((dist) => (
                        <option key={dist.user_id} value={dist.user_id}>
                          {dist.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-gray-500">Waiting for Approval</span>
                  )}
                </td>
                <td className="p-3">
                  {getCertificateByDocumentId(doc.document_id) ? (
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
