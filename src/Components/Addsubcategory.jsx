/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState({ subcategory_name: "", category_id: "" });
  const [editingId, setEditingId] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subcategories`);
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addSubcategory = async () => {
    if (!newSubcategory.subcategory_name.trim() || !newSubcategory.category_id) {
      Swal.fire("Error", "Please fill all fields!", "error");
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/subcategories`, newSubcategory);
      setNewSubcategory({ subcategory_name: "", category_id: "" });
      setIsAdding(false);
      fetchSubcategories();
      Swal.fire("Success", "Subcategory added successfully!", "success");
    } catch (error) {
      console.error("Error adding subcategory:", error);
      Swal.fire("Error", "Failed to add subcategory", "error");
    }
  };

  const handleEditSubcategory = (id, name) => {
    setEditingId(id);
    setUpdatedName(name);
  };

  const updateSubcategory = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/subcategories/${id}`, { subcategory_name: updatedName });
      setSubcategories(subcategories.map((sub) =>
        sub.subcategory_id === id ? { ...sub, subcategory_name: updatedName } : sub
      ));
      setEditingId(null);
      setUpdatedName("");
      Swal.fire("Updated", "Subcategory updated successfully!", "success");
    } catch (error) {
      console.error("Error updating subcategory:", error);
      Swal.fire("Error", "Failed to update subcategory", "error");
    }
  };

  const deleteSubcategory = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This subcategory will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/subcategories/${id}`);
        setSubcategories(subcategories.filter((sub) => sub.subcategory_id !== id));
        Swal.fire("Deleted!", "Subcategory has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting subcategory:", error);
        Swal.fire("Error", "Failed to delete subcategory", "error");
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-10 bg-gray-100">
      <div className="w-full   p-6 ">
        {/* <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Manage Subcategories</h2> */}

        <div className="flex justify-end -mt-10">
          <button
            onClick={() => setIsAdding(true)}
            className="bg-[#00234E] text-white px-5 py-3  text-lg rounded-lg hover:opacity-90 transition duration-200 flex items-center"
          >
            <FaPlus className="mr-2" /> Add Subcategory
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full max-w-7xl -mt-2 bg-white p-6  shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Subcategory List</h2>

        <div className="overflow-y-auto max-h-60 border border-gray-300">
          <table className="w-full border-collapse">
            <thead className="bg-gray-300 text-black sticky top-0">
              <tr>
                <th className="p-3 text-left border-r border-gray-400">ID</th>
                <th className="p-3 text-left border-r border-gray-400">Subcategory Name</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.length > 0 ? (
                subcategories.map((sub, index) => (
                  <tr key={sub.subcategory_id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-3 border-r border-gray-400">{sub.subcategory_id}</td>
                    <td className="p-3 border-r border-gray-400">
                      {editingId === sub.subcategory_id ? (
                        <input
                          type="text"
                          value={updatedName}
                          onChange={(e) => setUpdatedName(e.target.value)}
                          className="border border-gray-400 p-2 rounded"
                        />
                      ) : (
                        sub.subcategory_name
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {editingId === sub.subcategory_id ? (
                        <button
                          onClick={() => updateSubcategory(sub.subcategory_id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditSubcategory(sub.subcategory_id, sub.subcategory_name)}
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                        >
                          <FaEdit />
                        </button>
                      )}
                      <button
                        onClick={() => deleteSubcategory(sub.subcategory_id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-500">
                    No subcategories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup for Adding Subcategory */}
      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add Subcategory</h3>
            <input
            type="text"
            placeholder="Enter subcategory name"
            className="border p-2 rounded w-full mb-4"
            value={newSubcategory.subcategory_name}
            onChange={(e) => setNewSubcategory({ ...newSubcategory, subcategory_name: e.target.value })}
          />
          <select
            className="border p-2 rounded w-full mb-4"
            value={newSubcategory.category_id}
            onChange={(e) => setNewSubcategory({ ...newSubcategory, category_id: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
          <div className="flex gap-4">
            <button onClick={addSubcategory} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Save
            </button>
            <button onClick={() => setIsAdding(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
              Cancel
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subcategories;
