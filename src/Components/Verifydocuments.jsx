import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegFileAlt,FaCheck, FaTimes } from "react-icons/fa"; // Importing document icon

const VerifyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/documents/list")
      .then((response) => setDocuments(response.data.documents))
      .catch((error) => console.error("Error fetching documents:", error));

    axios
      .get("http://localhost:3000/users/distributors")
      .then((response) => setDistributors(response.data))
      .catch((error) => console.error("Error fetching distributors:", error));

    axios
      .get("http://localhost:3000/certificates")
      .then((response) => setCertificates(response.data))
      .catch((error) => console.error("Error fetching certificates:", error));
  }, []);

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
    <div className="container max-w-6xl bg-white p-6  ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Verify Documents</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-300 sticky top-0">
            <tr>
              <th className="border p-2">Document Id</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Subcategory</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Documents</th>
              <th className="border p-2">Verification</th>
              <th className="border p-2">Actions</th>
              <th className="border p-2">Assign Distributor</th>
              <th className="border p-2">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.document_id} className="border-t hover:bg-gray-100">
                <td className="border p-2 text-center">{doc.document_id}</td>
                <td className="border p-2">{doc.category_name}</td>
                <td className="border p-2">{doc.subcategory_name}</td>
                <td className="border p-2">{doc.name}</td>
                <td className="border p-2">{doc.email}</td>
                <td className="border p-2">{doc.phone}</td>
                <td className="border p-2">{doc.address}</td>
                <td className="border p-2">
                  <div className="flex justify-center">
                    {doc.documents?.map((file, index) => (
                      <a key={index} href={file.file_path} target="_blank" rel="noopener noreferrer">
                        <FaRegFileAlt className="text-blue-500 text-lg" />
                      </a>
                    ))}
                  </div>
                </td>
                <td className="border p-2">
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${
                    doc.status === "Approved" ? "bg-green-500" :
                    doc.status === "Rejected" ? "bg-red-500" :
                    "bg-blue-500"
                  }`}>
                    {doc.status}
                  </span>
                </td>
                
<td className="p-3 flex justify-center space-x-2">
  <button 
    onClick={() => handleUpdateStatus(doc.document_id, "Approved")} 
    className="bg-green-500 text-white px-3 py-1 rounded flex justify-center items-center"
  >
    <FaCheck className="text-white" />
  </button>
  <button 
    onClick={() => handleUpdateStatus(doc.document_id, "Rejected")} 
    className="bg-red-500 text-white px-3 py-1 rounded flex justify-center items-center"
  >
    <FaTimes className="text-white" />
  </button>
  <button 
    onClick={() => handleUpdateStatus(doc.document_id, "Completed")} 
    className="bg-blue-500 text-white px-3 py-1 rounded flex justify-center items-center"
  >
    <FaCheck className="text-white" />
  </button>
</td>

                <td className="border p-2">
                  <select onChange={(e) => handleAssignDistributor(doc.document_id, e.target.value)} value={doc.distributor_id || ""} className="p-2 border rounded w-full">
                    <option value="">Select</option>
                    {distributors.map((dist) => (
                      <option key={dist.user_id} value={dist.user_id}>{dist.name}</option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">
                  {getCertificateByDocumentId(doc.document_id) && (
                    <div className="flex justify-center">
                      <button onClick={() => handleViewCertificate(doc.document_id)} className="bg-blue-500 text-white px-3 py-1 rounded">
                        <FaRegFileAlt />
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
