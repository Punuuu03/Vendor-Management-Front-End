import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegFileAlt, FaFileInvoice,FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

const VerifyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/documents/list")
      .then((response) => {
        const sortedDocuments = response.data.documents.sort(
          (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)
        );
        setDocuments(sortedDocuments); // Ensure documents are sorted from newest to oldest
      })
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

  // Function to handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Function to handle search query change
  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter documents based on selected status
  const filteredDocuments = documents
    .filter((doc) =>
      statusFilter ? doc.status.toLowerCase() === statusFilter.toLowerCase() : true
    )
    .filter((doc) =>
      searchQuery
        ? doc.document_id.toLowerCase().includes(searchQuery) ||
        doc.name.toLowerCase().includes(searchQuery) ||
        doc.email.toLowerCase().includes(searchQuery) ||
        doc.phone.toLowerCase().includes(searchQuery)
        : true
    );

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


  const handleViewInvoice = (documentId, categoryId, subcategoryId) => {
    navigate(`/Invoice/${documentId}`, { state: { categoryId, subcategoryId } });
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
    <div className="ml-[300px] flex flex-col items-center min-h-screen p-10 bg-gray-100">
      <div className="w-full p-6">
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Verify Documents</h2>

        {/* Flexbox container for Status Filter and Search Bar */}
        <div className="mb-4 flex justify-between items-center">
          {/* Status Filter Dropdown */}
          <div className="mr-4">
            <label htmlFor="statusFilter" className="mr-2 text-sm">Filter by Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="p-2 border rounded text-sm"
            >
              <option value="">All</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="p-2 border rounded w-[200px] text-sm" // Decreased the width for the search bar
          />
        </div>

        <div className="table-container overflow-x-auto overflow-y-auto max-h-[550px]">
          <table className="table border-collapse border border-gray-300 min-w-full">
            <thead className="sticky-header">
              <tr>
                <th className="border p-2 text-center text-sm font-semibold">Sr No.</th>
                <th className="border p-2 text-center text-sm font-semibold">Document Id</th>
                <th className="border p-2 text-sm font-semibold">Category</th>
                <th className="border p-2 text-sm font-semibold">Subcategory</th>
                <th className="border p-2 text-sm font-semibold">Name</th>
                <th className="border p-2 text-sm font-semibold">Email</th>
                <th className="border p-2 text-sm font-semibold">Phone</th>
                <th className="border p-2 text-sm font-semibold">Address</th>
                <th className="border p-2 text-sm font-semibold">Documents</th>
                <th className="border p-2 text-sm font-semibold">Documents Fields</th>
                <th className="border p-2 text-sm font-semibold">Verification</th>
                <th className="border p-2 text-sm font-semibold">Actions</th>
                <th className="border p-2 text-sm font-semibold">Assign Distributor</th>
                <th className="border p-2 text-sm font-semibold">Certificate</th>
                <th className="border p-2 text-sm font-semibold">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc, index) => (
                <tr key={doc.document_id} className="border-t hover:bg-gray-100">
                  <td className="border p-2 text-center text-sm">{index + 1}</td>
                  <td className="border p-2 text-center text-sm">{doc.document_id}</td>
                  <td className="border p-2 text-sm">{doc.category_name}</td>
                  <td className="border p-2 text-sm">{doc.subcategory_name}</td>
                  <td className="border p-2 text-sm">{doc.name}</td>
                  <td className="border p-2 text-sm">{doc.email}</td>
                  <td className="border p-2 text-sm">{doc.phone}</td>
                  <td className="border p-2 text-sm">{doc.address}</td>

                  <td className="border p-2">
                    <div className="flex justify-center">
                      {doc.documents?.map((file, index) => (
                        <a key={index} href={file.file_path} target="_blank" rel="noopener noreferrer">
                          <FaRegFileAlt className="text-blue-500 text-lg" />
                        </a>
                      ))}
                    </div>
                  </td>
                  <td>{JSON.stringify(doc.document_fields)}</td>

                  <td className="border p-2 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${doc.status === "Approved"
                        ? "bg-green-500"
                        : doc.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-blue-500"
                        }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center space-x-2 text-sm">
                    <button
                      onClick={() => handleUpdateStatus(doc.document_id, "Approved")}
                      className="bg-green-500 text-white px-3 py-1 rounded flex justify-center items-center hover:bg-green-600 transition"
                    >
                      <FaCheck className="text-white" />
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(doc.document_id, "Rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded flex justify-center items-center hover:bg-red-600 transition"
                    >
                      <FaTimes className="text-white" />
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(doc.document_id, "Completed")}
                      className="bg-blue-500 text-white px-3 py-1 rounded flex justify-center items-center hover:bg-blue-600 transition"
                    >
                      <FaCheck className="text-white" />
                    </button>
                  </td>

                  <td className="border p-2 text-sm">
                    <select
                      onChange={(e) => handleAssignDistributor(doc.document_id, e.target.value)}
                      value={doc.distributor_id || ""}
                      className="p-2 border rounded w-full hover:border-blue-500 transition text-sm"
                    >
                      <option value="">Select</option>
                      {distributors.map((dist) => (
                        <option key={dist.user_id} value={dist.user_id}>
                          {dist.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2 text-sm">
                    {getCertificateByDocumentId(doc.document_id) ? (
                      <button
                        onClick={() => handleViewCertificate(doc.document_id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded flex justify-center items-center hover:bg-blue-600 transition"
                      >
                        View Certificate
                      </button>
                    ) : (
                      <span>No Certificate</span>
                    )}



                  </td>


                  {/* New Invoice Button Column */}
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleViewInvoice(doc.document_id)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded flex justify-center items-center hover:bg-indigo-600 transition"
                    >
                      <FaFileInvoice className="mr-1" /> Invoice
                    </button>
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
