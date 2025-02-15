// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

const FieldNames = () => {
    const [fields, setFields] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
      category_id: "",
      subcategory_id: "",
      document_fields: "",
    });
    const [editId, setEditId] = useState(null);
  // Fetch documents
  useEffect(() => {
    fetchFields();
    fetchCategories();
  }, []);

  // Fetch required documents
  const fetchFields = async () => {
    try {
      const response = await axios.get("http://localhost:3000/field-names");
      setFields(response.data);
    } catch (error) {
      console.error("Error fetching field names:", error);
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
      const response = await axios.get(`http://localhost:3000/subcategories/category/${categoryId}`);
      
      // Assuming response.data is already an array
      setSubcategories(response.data);  
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]); // Clear the list on error
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
      await axios.delete(`http://localhost:3000/field-names/${id}`);
      Swal.fire("Deleted!", "Field Name deleted successfully", "success");
      fetchFields();
    } catch (error) {
      Swal.fire("Error!", "Failed to delete Field Name", "error");
    }
  };

  // Handle edit document
  const handleEdit = (field) => {
    setEditId(field.id);
    setFormData({
      category_id: field.category.category_id,
      subcategory_id: field.subcategory.subcategory_id,
      document_fields: field.document_fields,
    });
    fetchSubcategories(field.category.category_id);
    setModalOpen(true);
  };

  
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3000/field-names/${editId}`, formData);
        Swal.fire("Updated!", "Field Name updated successfully", "success");
      } else {
        await axios.post("http://localhost:3000/field-names", formData);
        Swal.fire("Added!", "Field Name added successfully", "success");
      }
      fetchFields();
      setModalOpen(false);
      setFormData({ category_id: "", subcategory_id: "", document_fields: "" });
      setEditId(null);
    } catch (error) {
      Swal.fire("Error!", "Failed to save Field Name", "error");
    }
  };


  return (
    <div className="container bg-white mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Field Names</h1>
        <button onClick={() => setModalOpen(true)} className="bg-[#00234E] text-white px-4 py-2 rounded">
          Add Field Names
        </button>
      </div>

      <div className="overflow-x-auto ">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-300 sticky top-0">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Field Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Subcategory</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="border p-2 text-center">{field.id}</td>
                <td className="border p-2 text-center">{field.document_fields}</td>
                <td className="border p-2 text-center">{field.category.category_name}</td>
                <td className="border p-2 text-center">{field.subcategory.subcategory_name}</td>
                <td className="border p-2 flex justify-center space-x-2">
                  <FaEdit onClick={() => handleEdit(field)} className="text-yellow-500 cursor-pointer" />
                  <FaTrash onClick={() => handleDelete(field.id)} className="text-red-500 cursor-pointer" />
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
            <h2 className="text-xl font-bold mb-4">{editId ? "Edit Field" : "Add Field"}</h2>
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
                placeholder="Field Name"
                className="w-full border p-2 mb-2"
                value={formData.document_fields}
                onChange={(e) => setFormData({ ...formData, document_fields: e.target.value })}
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

export default FieldNames;
