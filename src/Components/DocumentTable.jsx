import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const DocumentTable = () => {
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ doc_type_name: "" });
  const [editingDoc, setEditingDoc] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/document-types");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoc) {
        await axios.put(`http://localhost:3000/document-types/${editingDoc.doc_type_id}`, formData);
      } else {
        await axios.post("http://localhost:3000/document-types/", formData);
      }
      setIsModalOpen(false);
      fetchDocuments();
      setFormData({ doc_type_name: "" });
      setEditingDoc(null);
    } catch (error) {
      console.error("Error submitting document:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/document-types/${id}`);
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleEdit = (doc) => {
    setFormData({ doc_type_name: doc.doc_type_name });
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  return (
    <div className="container bg-white mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Documents</h2>
        <button className="bg-[#00234E] text-white px-4 py-2 rounded flex items-center hover:bg-blue-600" onClick={() => setIsModalOpen(true)}>
          <FaPlus className="mr-2" /> Add Document
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-300 sticky top-0">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Document Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
  {documents.map((doc, index) => (
    <tr key={doc.doc_type_id} className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}>
      <td className="border p-2 text-center">{doc.doc_type_id}</td>
      <td className="border p-2 text-center">{doc.doc_type_name}</td>
      <td className="border p-2 flex gap-2 justify-center text-center">
        <button onClick={() => handleEdit(doc)} className="text-blue-500 hover:text-blue-700 mx-2">
          <FaEdit />
        </button>
        <button onClick={() => handleDelete(doc.doc_type_id)} className="text-red-500 hover:text-red-700 mx-2">
          <FaTrash />
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{editingDoc ? "Edit Document" : "Add Document"}</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2">Document Name:</label>
              <input
                type="text"
                name="doc_type_name"
                value={formData.doc_type_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg mb-4"
              />
              <div className="flex justify-end">
                <button type="button" className="mr-2 px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  {editingDoc ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTable;
