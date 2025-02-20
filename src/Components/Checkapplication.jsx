import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const SearchApplication = () => {
  const [userId, setUserId] = useState(null);
  const [applicationId, setApplicationId] = useState("");
  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");

  // Fetch user ID from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.user_id);
    }
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!applicationId) {
      setError("Please enter an Application ID");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/userdashboard/fetch/${userId}/${applicationId}`);
      setDocument(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching document:", err);
      setDocument(null);
      setError("No document found for this Application ID.");
    }
  };

  return (
    <div className="ml-[260px] flex flex-col items-center min-h-screen p-10 bg-gray-100">
      {/* Search Bar */}
      <div className="w-full max-w-lg bg-white p-4 shadow-md flex items-center rounded-lg">
        <input
          type="text"
          placeholder="Enter Application ID..."
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-r">
          <FaSearch size={20} />
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Document Details */}
      {document && (
        <div className="mt-6 w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">Application Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2 border-b"><strong>Application ID:</strong> {document.application_id}</div>
            <div className="p-2 border-b"><strong>User ID:</strong> {document.user_id}</div>
            <div className="p-2 border-b"><strong>Name:</strong> {document.name}</div>
            <div className="p-2 border-b"><strong>Email:</strong> {document.email}</div>
            <div className="p-2 border-b"><strong>Phone:</strong> {document.phone}</div>
            <div className="p-2 border-b"><strong>Address:</strong> {document.address}</div>
            <div className="p-2 border-b"><strong>Category:</strong> {document.category_name}</div>
            <div className="p-2 border-b"><strong>Subcategory:</strong> {document.subcategory_name}</div>
            <div className="p-2 border-b"><strong>Status:</strong> {document.status}</div>
            <div className="p-2 border-b"><strong>Uploaded At:</strong> {new Date(document.uploaded_at).toLocaleString()}</div>
          </div>

          {/* Document Fields */}
          <h3 className="mt-4 text-lg font-bold">Document Fields</h3>
          <div className="bg-gray-100 p-3 rounded">
            {Object.entries(document.document_fields).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
          </div>

          {/* Uploaded Documents */}
          <h3 className="mt-4 text-lg font-bold">Uploaded Documents</h3>
          <ul className="list-disc list-inside">
            {document.documents.map((doc, index) => (
              <li key={index}>
                {doc.document_type}: 
                <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  View File
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchApplication;
