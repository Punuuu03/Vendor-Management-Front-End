import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const InvoicePage = () => {
  const { documentId } = useParams();
  const [documentData, setDocumentData] = useState(null);
  const [documentNames, setDocumentNames] = useState({});
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchDocumentData();
  }, [documentId]);

  const fetchDocumentData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/singledocument/documentby/${documentId}`);
      setDocumentData(response.data);

      // Fetch document field names based on category and subcategory IDs
      const { category_id, subcategory_id } = response.data;
      const fieldNamesResponse = await axios.get(`http://localhost:3000/field-names/${category_id}/${subcategory_id}`);
      setDocumentNames(fieldNamesResponse.data);
    } catch (error) {
      console.error('Error fetching document data:', error);
    }
  };

  if (!documentData) return <div className="text-center text-lg mt-10">Loading Invoice...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Invoice</h1>

      {/* General Document Information */}
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
      </div>

      {/* Document Fields */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">Document Fields</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(documentData.document_fields).map(([key, value], index) => (
          <div key={index} className="border p-2 rounded">
            <strong>{key}:</strong> {value}
          </div>
        ))}
      </div>

      {/* Documents Section */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Documents</h2>
      <div className="space-y-2">
        {documentData.documents.map((doc, index) => (
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
        <div className="mt-6 border rounded-lg p-4 bg-gray-100">
          <h3 className="text-xl font-medium mb-2">Document Preview</h3>
          <iframe
            src={selectedDocument}
            title="Document Preview"
            className="w-full h-96 border rounded"
          />
        </div>
      )}
    </div>
  );
};

export default InvoicePage;
