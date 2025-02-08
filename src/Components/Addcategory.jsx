/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTag } from 'react-icons/fa'; // Import the FaTag icon for category

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Category Added:', categoryName);
    navigate('/categorylist'); // Redirect to the category list
  };

  const handleClose = () => {
    navigate('/categorylist');
  };

  return (
    <div className="flex justify-center items-start min-h-screen pt-10"> {/* Container at the top */}
      <div className="relative w-[700px] h-[250px] mx-auto p-5 bg-white rounded-lg shadow-2xl border border-gray-300"> {/* Increased width & height */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 transition duration-200 text-4xl p-1"
        >
          &times; {/* Close button */}
        </button>
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-8 text-[#1e293b]">Add Category</h2> {/* Bigger heading */}

          {/* Category Name Input */}
          <div className="mb-6">
            <label className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
              <FaTag className="text-purple-800 p-3 text-4xl font-bold" /> {/* Bigger icon */}
              <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="flex-grow p-3 text-lg border-none outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1e293b] to-purple-800 text-white py-3 text-lg rounded hover:bg-gradient-to-l transition duration-200"
          >
            <strong>Add Category</strong>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
