import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { FaCheck, FaTimes, FaUserPlus } from 'react-icons/fa';


const InvoicePage = () => {
  const { documentId } = useParams();
  const location = useLocation();
  const { categoryId: stateCategoryId, subcategoryId: stateSubcategoryId } = location.state || {};

  const [documentData, setDocumentData] = useState(null);
  const [documentNames, setDocumentNames] = useState({});
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [distributors, setDistributors] = useState([]);
  const [showDistributorList, setShowDistributorList] = useState(false);
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/distributors")
      .then((response) => setDistributors(response.data))
      .catch((error) => console.error("Error fetching distributors:", error));
  }, []);

  useEffect(() => {
    console.log("Fetched from previous page state:");
    console.log("Document ID:", documentId);
    console.log("Category ID:", stateCategoryId);
    console.log("Subcategory ID:", stateSubcategoryId);
  }, [documentId, stateCategoryId, stateSubcategoryId]);

  const handleUpdateStatus = async (newStatus) => {
    if (newStatus === "Rejected" && !rejectionReason.trim()) {
      alert("Please enter a reason for rejection.");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/documents/update-status/${documentId}`, {
        status: newStatus,
        rejectionReason: newStatus === "Rejected" ? rejectionReason : undefined,
      });

      setDocumentData((prev) => ({ ...prev, status: newStatus }));
      alert(`Status updated to ${newStatus}`);

      // Reset the rejection input field after sending
      setShowRejectionInput(false);
      setRejectionReason('');
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleAssignDistributor = async (distributorId) => {
    if (!distributorId) return;
    try {
      await axios.put(`http://localhost:3000/documents/assign-distributor/${documentId}`, {
        distributor_id: distributorId,
      });
      setDocumentData((prev) => ({ ...prev, distributor_id: distributorId }));
      alert("Distributor assigned successfully!");
      setShowDistributorList(false);
    } catch (error) {
      console.error("Error assigning distributor:", error);
      alert("Failed to assign distributor.");
    }
  };

  const fetchDocumentData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/singledocument/documentby/${documentId}`);
      const data = response.data.document;
      setDocumentData(data);

      const category = stateCategoryId || data.category_id;
      const subcategory = stateSubcategoryId || data.subcategory_id;

      if (category && subcategory) {
        const fieldNamesResponse = await axios.get(`http://localhost:3000/field-names/${category}/${subcategory}`);
        setDocumentNames(fieldNamesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching document data:', error);
    }
  }, [documentId, stateCategoryId, stateSubcategoryId]);

  useEffect(() => {
    if (documentId) {
      fetchDocumentData();
    }
  }, [documentId, fetchDocumentData]);

  if (!documentData) return <div className="text-center text-lg mt-10">Loading Invoice...</div>;

  return (
    <div className="flex max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10 space-x-6">
      {/* Left Side - Invoice */}
      <div className="w-1/2">
        <h1 className="text-3xl font-bold text-center mb-6">Invoice</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div><strong>Application ID:</strong> {documentData.application_id}</div>
          <div><strong>User ID:</strong> {documentData.user_id}</div>
          <div><strong>Category:</strong> {documentData.category_name}</div>
          <div><strong>Subcategory:</strong> {documentData.subcategory_name}</div>
          <div><strong>Name:</strong> {documentData.name}</div>
          <div><strong>Email:</strong> {documentData.email}</div>
          <div><strong>Phone:</strong> {documentData.phone}</div>
          <div><strong>Status:</strong> {documentData.status}</div>
          <div className="col-span-2"><strong>Address:</strong> {documentData.address}</div>



        
        <h2 className="text-2xl font-semibold mt-6 mb-4">Document Fields</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(documentData.document_fields || {}).map(([key, value], index) => (
            <div key={index} className="border p-2 rounded">
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
    
        </div>

        {/* Status Update Buttons */}
        <div>
      <div className="flex space-x-4 mb-4">
        {/* Approve Button */}
        <button
          onClick={() => handleUpdateStatus("Approved")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <FaCheck className="inline-block mr-2" /> Approve
        </button>

        {/* Reject Button */}
        <button
          onClick={() => setShowRejectionInput(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          <FaTimes className="inline-block mr-2" /> Reject
        </button>
      </div>

      {/* Rejection Reason Input */}
      {showRejectionInput && (
        <div className="space-y-4">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Enter reason for rejection"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
          />
          <div className="flex space-x-4">
            {/* Send Button */}
            <button
              onClick={() => handleUpdateStatus("Rejected")}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Send
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => {
                setShowRejectionInput(false);
                setRejectionReason('');
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
        {/* Assign Distributor Button */}
        <button
          onClick={() => setShowDistributorList(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <FaUserPlus className="inline-block mr-2" /> Assign Distributor
        </button>

        {showDistributorList && (
          <div className="mt-4 border p-4 rounded bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Select a Distributor</h3>
            <ul className="space-y-2">
              {distributors.map((dist) => (
                <li key={dist.user_id}>
                  <button
                    onClick={() => handleAssignDistributor(dist.user_id)}
                    className="w-full text-left p-2 rounded hover:bg-blue-100"
                  >
                    {dist.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right Side - Documents and Preview */}
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Documents</h2>
        <div className="space-y-2">
          {documentData.documents?.map((doc, index) => (
            <div
              key={index}
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => setSelectedDocument(doc.file_path)}
            >
              {documentNames[doc.document_type] || doc.document_type}
            </div>
          ))}
        </div>

        {/* Document Preview Container */}
        {selectedDocument && (
          <div className="mt-6 border rounded-lg p-4 bg-gray-100 h-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
              onClick={() => setSelectedDocument(null)}
            >
              &times;
            </button>
            <h3 className="text-xl font-medium mb-2">Document Preview</h3>
            <iframe
              src={selectedDocument}
              title="Document Preview"
              className="w-full h-full border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePage;
