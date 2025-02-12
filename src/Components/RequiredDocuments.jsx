// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

const RequiredDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category_id: "",
    subcategory_id: "",
    document_names: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch documents
  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, []);

  // Fetch required documents
  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/required-documents");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch subcategories based on selected category
  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) return;
    try {
      const response = await axios.get(`http://localhost:3000/subcategories/${categoryId}`);
      setSubcategories([response.data]); // Ensure response is in an array
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setFormData({ ...formData, category_id: selectedCategoryId, subcategory_id: "" });
    fetchSubcategories(selectedCategoryId);
  };

  // Handle delete document
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/required-documents/${id}`);
      Swal.fire("Deleted!", "Document deleted successfully", "success");
      fetchDocuments();
    } catch (error) {
      Swal.fire("Error!", "Failed to delete document", "error");
    }
  };

  // Handle edit document
  const handleEdit = (doc) => {
    setEditId(doc.id);
    setFormData({
      category_id: doc.category.category_id,
      subcategory_id: doc.subcategory.subcategory_id,
      document_names: doc.document_names,
    });
    fetchSubcategories(doc.category.category_id);
    setModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3000/required-documents/${editId}`, formData);
        Swal.fire("Updated!", "Document updated successfully", "success");
      } else {
        await axios.post("http://localhost:3000/required-documents", formData);
        Swal.fire("Added!", "Document added successfully", "success");
      }
      fetchDocuments();
      setModalOpen(false);
      setFormData({ category_id: "", subcategory_id: "", document_names: "" });
      setEditId(null);
    } catch (error) {
      Swal.fire("Error!", "Failed to save document", "error");
    }
  };

  return (
    <div className="container bg-white mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Required Documents</h1>
        <button onClick={() => setModalOpen(true)} className="bg-[#00234E] text-white px-4 py-2 rounded">
          Add Document
        </button>
      </div>

      <div className="overflow-x-auto ">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-300 sticky top-0">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Documents</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Subcategory</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={doc.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="border p-2 text-center">{doc.id}</td>
                <td className="border p-2 text-center">{doc.document_names}</td>
                <td className="border p-2 text-center">{doc.category.category_name}</td>
                <td className="border p-2 text-center">{doc.subcategory.subcategory_name}</td>
                <td className="border p-2 flex justify-center space-x-2">
                  <FaEdit onClick={() => handleEdit(doc)} className="text-yellow-500 cursor-pointer" />
                  <FaTrash onClick={() => handleDelete(doc.id)} className="text-red-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding/Editing Documents */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">{editId ? "Edit Document" : "Add Document"}</h2>
            <form onSubmit={handleSubmit}>
              {/* Category Dropdown */}
              <select
                className="w-full border p-2 mb-2"
                value={formData.category_id}
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>

              {/* Subcategory Dropdown */}
              <select
                className="w-full border p-2 mb-2"
                value={formData.subcategory_id}
                onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                disabled={!formData.category_id}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub.subcategory_id} value={sub.subcategory_id}>
                    {sub.subcategory_name}
                  </option>
                ))}
              </select>

              {/* Document Names */}
              <input
                type="text"
                placeholder="Document Names"
                className="w-full border p-2 mb-2"
                value={formData.document_names}
                onChange={(e) => setFormData({ ...formData, document_names: e.target.value })}
              />

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequiredDocuments;
