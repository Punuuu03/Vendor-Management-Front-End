import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const Apply = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [documentNames, setDocumentNames] = useState([]); // State for document names
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    category_id: "",
    subcategory_id: "",
    name: userData.name || "",
    email: userData.email || "",
    phone: userData.phone || "",
    address: "",
    files: [],
  });

  // Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:3000/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.category_id) {
      axios.get("http://localhost:3000/subcategories")
        .then((response) => {
          const filteredSubcategories = response.data.filter(
            (sub) => sub.category.category_id === parseInt(formData.category_id)
          );
          setSubcategories(filteredSubcategories);
          if (filteredSubcategories.length > 0) {
            setFormData((prev) => ({
              ...prev,
              subcategory_id: filteredSubcategories[0].subcategory_id // Auto-select first subcategory
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              subcategory_id: "" // Reset if no subcategories
            }));
          }
        })
        .catch((error) => console.error("Error fetching subcategories:", error));
    } else {
      setSubcategories([]);
      setFormData((prev) => ({ ...prev, subcategory_id: "" }));
    }
  }, [formData.category_id]);

  // Fetch documents when category and subcategory change
  useEffect(() => {
    if (formData.category_id && formData.subcategory_id) {
      axios.get(`http://localhost:3000/required-documents`, {
        params: {
          category_id: parseInt(formData.category_id, 10),
          subcategory_id: parseInt(formData.subcategory_id, 10),
        }
      })
        .then((response) => {
          if (response.data.length > 0 && response.data[0].document_names) {
            const documentsArray = response.data[0].document_names.split(",").map(doc => doc.trim());
            setDocumentNames([...documentsArray]);
          } else {
            setDocumentNames([]);
          }
        })
        .catch((error) => console.error("Error fetching documents:", error));
    } else {
      setDocumentNames([]);
    }
  }, [formData.category_id, formData.subcategory_id]);

  // Handle file selection and validation
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= 200000); // 200 KB size limit
    const invalidFiles = files.filter(file => file.size > 200000);

    if (invalidFiles.length > 0) {
      alert("Some files exceed 200 KB and were not added.");
    }

    setFormData((prev) => ({ ...prev, files: [...prev.files, ...validFiles] }));
    setSelectedFiles([...selectedFiles, ...validFiles.map((file) => file.name)]);
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    const formDataToSend = new FormData();

    // Append form fields to formData
    Object.keys(formData).forEach((key) => {
      if (key !== "files") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append selected category and subcategory names
    const selectedCategory = categories.find(cat => cat.category_id === parseInt(formData.category_id));
    const selectedSubcategory = subcategories.find(sub => sub.subcategory_id === parseInt(formData.subcategory_id));

    formDataToSend.append("category_name", selectedCategory ? selectedCategory.category_name : "");
    formDataToSend.append("subcategory_name", selectedSubcategory ? selectedSubcategory.subcategory_name : "");

    // Append files to formData
    formData.files.forEach((file) => {
      formDataToSend.append("files", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/documents/upload",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage("Your application has been submitted successfully! You will be contacted soon.");
      setIsSubmitted(true); // Hide the form after submission
      console.log("Success:", response.data);
    } catch (error) {
      setMessage("Failed to submit application. Please try again.");
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (


    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      {!isSubmitted ? (
        <form
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl"
          onSubmit={handleSubmit}  // Add this line here to bind handleSubmit function
        >

          {/* Category Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium text-lg">
              Category
            </label>
            <select
              name="category_id"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium text-lg">
              Subcategory
            </label>
            <select
              name="subcategory_id"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              value={formData.subcategory_id}
              onChange={handleChange}
              required
              disabled={!formData.category_id}
            >
              <option value="">Select a Subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                  {subcategory.subcategory_name}
                </option>
              ))}
            </select>
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
              value={formData.name}
              readOnly
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
              value={formData.email}
              readOnly
            />
          </div>

          {/* Phone Number Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium text-lg">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-gray-100"
              value={formData.phone}
              readOnly
            />
          </div>

          {/* Address Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium text-lg">
              Address
            </label>
            <textarea
              name="address"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              required
              onChange={handleChange}
            ></textarea>
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium text-lg">
              Upload Files (Max 200 KB per file)
            </label>
            <input
              type="file"
              name="files"
              multiple
              onChange={handleFileUpload}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Selected Files:</p>
                <ul className="list-disc ml-5">
                  {selectedFiles.map((fileName, index) => (
                    <li key={index}>{fileName}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Required Documents */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium text-lg">
              Required Documents
            </label>
            {documentNames.length > 0 ? (
              <ul className="list-disc ml-5 mt-2">
                {documentNames.map((doc, index) => (
                  <li key={index} className="text-gray-800">{doc}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-2">No documents required.</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg shadow-lg"
          >
            Submit Application
          </button>
        </form>
      ) : (
        <div className="text-2xl font-semibold text-green-600">
          {message}
        </div>
      )}
    </div>
  );
};

export default Apply;

