import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

const Apply = () => {
  const [documentNames, setDocumentNames] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const location = useLocation();
  const { categoryId, categoryName, subcategoryId, subcategoryName } =
    location.state || {};

  const token = localStorage.getItem("token");
  let userData = { user_id: "", name: "", email: "", phone: "" };

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userData = {
        user_id: decoded.user_id,
        name: decoded.name,
        email: decoded.email,
        phone: decoded.phone,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const [formData, setFormData] = useState({
    user_id: userData.user_id || "",
    category_id: categoryId || "",
    subcategory_id: subcategoryId || "",
    category_name: categoryName || "",
    subcategory_name: subcategoryName || "",
    name: userData.name || "",
    email: userData.email || "",
    phone: userData.phone || "",
    address: "",
    files: {},
    fields: {},
  });

  // Fetch required documents when category and subcategory change
  useEffect(() => {
    if (formData.category_id && formData.subcategory_id) {
      axios
        .get(`http://localhost:3000/required-documents/${formData.category_id}/${formData.subcategory_id}`)
        .then((response) => {
          if (response.data.length > 0 && response.data[0].document_names) {
            const documentsArray = response.data[0].document_names
              .split(",")
              .map((doc) => doc.trim());
            setDocumentNames(documentsArray);
            setSelectedFiles(
              documentsArray.reduce((acc, doc) => ({ ...acc, [doc]: null }), {})
            );
          } else {
            setDocumentNames([]);
          }
        })
        .catch((error) => console.error("Error fetching documents:", error));
    } else {
      setDocumentNames([]);
    }
  }, [formData.category_id, formData.subcategory_id]);

  // Fetch field names dynamically
  useEffect(() => {
    if (formData.category_id && formData.subcategory_id) {
      axios
        .get(`http://localhost:3000/field-names/${formData.category_id}/${formData.subcategory_id}`)
        .then((response) => {
          if (response.data.length > 0 && response.data[0].document_fields) {
            const fieldsArray = response.data[0].document_fields
              .split(",")
              .map((field) => field.trim());
            setFieldNames(fieldsArray);
            setFormData((prev) => ({
              ...prev,
              document_fields: fieldsArray.reduce((acc, field) => ({ ...acc, [field]: "" }), {}),
            }));
          } else {
            setFieldNames([]);
          }
        })
        .catch((error) => console.error("Error fetching field names:", error));
    } else {
      setFieldNames([]);
    }
  }, [formData.category_id, formData.subcategory_id]);

  const handleFieldChange = (e, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      document_fields: { ...prev.document_fields, [fieldName]: e.target.value },
    }));
  };
  // Handle file upload
  const handleFileUpload = (e, docName) => {
    const file = e.target.files[0];
    setSelectedFiles((prev) => ({ ...prev, [docName]: file }));
    setFormData((prev) => ({
      ...prev,
      files: { ...prev.files, [docName]: file },
    }));
  };

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form...");

    const formDataToSend = new FormData();

    // Append all non-file fields
    Object.keys(formData).forEach((key) => {
      if (key !== "files" && key !== "fields") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append dynamically generated field inputs
    Object.keys(formData.fields).forEach((field) => {
      formDataToSend.append(field, formData.fields[field]);
    });

    // Append files with "files" as the key
    Object.keys(formData.files).forEach((docName) => {
      if (formData.files[docName]) {
        formDataToSend.append("files", formData.files[docName]);
      }
    });

    try {
      await axios.post(
        "http://localhost:3000/documents/upload",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Your application has been submitted successfully!");
    } catch (error) {
      console.error("Submission Error:", error.response);
      alert(`Failed to submit application: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <form
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl"
        onSubmit={handleSubmit}
      >
        {/* Category Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium text-lg">
            Category
          </label>
          <input
            type="text"
            name="category_name"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-gray-100"
            value={formData.category_name}
          
          />
        </div>

        {/* Subcategory Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium text-lg">
            Subcategory
          </label>
          <input
            type="text"
            name="subcategory_name"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-gray-100"
            value={formData.subcategory_name}
          
          />
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium text-lg">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-gray-100"
            onChange={handleChange}
      
          />
        </div>

        {/* Email Address */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium text-lg">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-gray-100"
            onChange={handleChange}
        
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium text-lg">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-gray-100"
            onChange={handleChange}
      
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium text-lg">Address</label>
          <textarea
            name="address"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            required
            onChange={handleChange}
          ></textarea>
        </div>



        <div className="mb-4">
      <label className="block text-gray-700 font-medium text-lg">Additional Fields</label>
      {fieldNames.length > 0 ? (
        fieldNames.map((field, index) => (
          <div key={index} className="mt-2">
            <label className="block text-gray-800 font-medium">{field}</label>
            <input
              type="text"
              name={field}
              value={formData.document_fields[field] || ""}
              onChange={(e) => handleFieldChange(e, field)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        ))
      ) : (
        <p className="text-gray-500 mt-2">No additional fields required.</p>
      )}
    </div>



    
        {/* Required Documents */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium text-lg">Required Documents</label>
          {documentNames.length > 0 ? (
            documentNames.map((doc, index) => (
              <div key={index} className="flex items-center space-x-4 mt-2">
                <p className="text-gray-800 font-medium w-1/2">{doc}</p>
                <input
                  type="file"
                  name={doc}
                  onChange={(e) => handleFileUpload(e, doc)}
                  className="w-1/2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-2">No documents required.</p>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default Apply;
