/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaTag, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const apiUrl = "http://localhost:3000/categories";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(apiUrl);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      Swal.fire("Error", "Category name cannot be empty!", "error");
      return;
    }

    try {
      const response = await axios.post(apiUrl, { category_name: categoryName });
      setCategories([...categories, response.data]);
      setCategoryName("");

      Swal.fire("Success", "Category added successfully!", "success");
    } catch (error) {
      console.error("Error adding category:", error);
      Swal.fire("Error", "Failed to add category", "error");
    }
  };

  const handleEditCategory = (id, name) => {
    setEditingId(id);
    setUpdatedName(name);
  };

  const handleUpdateCategory = async (id) => {
    try {
      await axios.patch(`${apiUrl}/${id}`, { category_name: updatedName });

      setCategories(
        categories.map((category) =>
          category.category_id === id ? { ...category, category_name: updatedName } : category
        )
      );

      setEditingId(null);
      setUpdatedName("");

      Swal.fire("Updated", "Category updated successfully!", "success");
    } catch (error) {
      console.error("Error updating category:", error);
      Swal.fire("Error", "Failed to update category", "error");
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        setCategories(categories.filter((category) => category.category_id !== id));
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting category:", error);
        Swal.fire("Error", "Failed to delete category", "error");
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-10 bg-gray-100">
      {/* Add Category Section */}
      <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Manage Categories</h2>

        <div className="flex items-center border-2 border-gray-300 rounded-lg shadow-md overflow-hidden">
          <FaTag className="text-purple-800 p-3 text-2xl" />
          <input
            type="text"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="flex-grow p-3 text-lg border-none outline-none"
          />
          <button
            onClick={handleAddCategory}
            className="bg-gradient-to-r from-purple-700 to-blue-600 text-white px-5 py-3 text-lg rounded-r-lg hover:opacity-90 transition duration-200 ml-4"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="w-full max-w-7xl mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Category List</h2>

        {/* Scrollable Table Wrapper */}
        <div className="overflow-y-auto max-h-60 border border-gray-300 rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-700 text-white sticky top-0">
              <tr>
                <th className="p-3 text-left border-r border-gray-400">ID</th>
                <th className="p-3 text-left border-r border-gray-400">Category Name</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr key={category.category_id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-3 border-r border-gray-400">{category.category_id}</td>
                    <td className="p-3 border-r border-gray-400">
                      {editingId === category.category_id ? (
                        <input
                          type="text"
                          value={updatedName}
                          onChange={(e) => setUpdatedName(e.target.value)}
                          className="border border-gray-400 p-2 rounded"
                        />
                      ) : (
                        category.category_name
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {editingId === category.category_id ? (
                        <button
                          onClick={() => handleUpdateCategory(category.category_id)}
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditCategory(category.category_id, category.category_name)}
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                        >
                          <FaEdit />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCategory(category.category_id)}
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
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
