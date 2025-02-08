import React, { useState } from "react";

const Apply = () => {
  // Subcategories Data
  const subcategories = {
    "New Aadhar Card": "Apply for a new Aadhar card",
    "Update Aadhar Details": "Update your existing Aadhar details",
    "New PAN Card": "Apply for a fresh PAN card",
    "PAN Correction": "Correct or update your PAN details",
    "New Income Certificate": "Apply for a new income certificate",
    "Renew Income Certificate": "Renew an existing income certificate",
  };

  // State Management
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    documents: [],
  });

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Multiple File Uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  // Remove Selected File
  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Application Submitted for ${selectedSubcategory}`);
    console.log("Uploaded Files:", formData.documents);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center py-12">
      <h2 className="text-4xl font-extrabold text-[#1e293b] mb-6 animate-fade-in">
        Apply for Government Documents
      </h2>

      {/* Apply Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 p-8 rounded-2xl shadow-2xl backdrop-blur-lg w-full max-w-3xl transition-all duration-300 transform hover:scale-105"
      >
        {/* Subcategory Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium text-lg">
            Select Subcategory
          </label>
          <select
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 transition-all duration-300 hover:shadow-lg"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
          >
            <option value="">-- Choose Subcategory --</option>
            {Object.keys(subcategories).map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>

        {/* User Details - Two Fields Per Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700 font-medium text-lg">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 transition-all duration-300 hover:shadow-lg"
              required
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium text-lg">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 transition-all duration-300 hover:shadow-lg"
              required
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700 font-medium text-lg">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 transition-all duration-300 hover:shadow-lg"
              required
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium text-lg">
              Address
            </label>
            <textarea
              name="address"
              placeholder="Enter your address"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 transition-all duration-300 hover:shadow-lg"
              required
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* Multiple File Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium text-lg">
            Upload Required Documents
          </label>
          <div className="relative w-full flex items-center justify-center border-dashed border-2 border-gray-400 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.png"
              className="absolute w-full h-full opacity-0 cursor-pointer"
              required
              onChange={handleFileUpload}
            />
            <p className="text-gray-500">Click or drag files here to upload</p>
          </div>

          {/* Display Selected Files */}
          {formData.documents.length > 0 && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg shadow">
              <h3 className="text-gray-700 font-medium mb-2">Selected Files:</h3>
              <ul className="space-y-2">
                {formData.documents.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-white p-2 rounded-lg shadow-md"
                  >
                    <span className="text-gray-800">{file.name}</span>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 font-bold"
                      onClick={() => removeFile(index)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full  bg-[#1e293b]  text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default Apply;
