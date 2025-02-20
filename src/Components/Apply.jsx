import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Apply = () => {
  const [documentNames, setDocumentNames] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const location = useLocation();
  const { categoryId, categoryName, subcategoryId, subcategoryName } = location.state || {};

  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState({
    user_id: "",
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = JSON.parse(atob(base64));

        setUserData({
          user_id: decodedPayload?.user_id ? String(decodedPayload.user_id) : "",
          name: decodedPayload?.name || "",
          email: decodedPayload?.email || "",
          phone: decodedPayload?.phone || "",
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const [formData, setFormData] = useState({
    user_id: "",
    category_id: categoryId || "",
    subcategory_id: subcategoryId || "",
    category_name: categoryName || "",
    subcategory_name: subcategoryName || "",
    name: "",
    email: "",
    phone: "",
    address: "",
    files: {},
    document_fields: {},
  });

  useEffect(() => {
    if (userData.user_id) {
      setFormData((prev) => ({
        ...prev,
        user_id: Number(userData.user_id),
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      }));
    }
  }, [userData]);

  useEffect(() => {
    if (formData.category_id && formData.subcategory_id) {
      axios
        .get(
          `http://localhost:3000/required-documents/${formData.category_id}/${formData.subcategory_id}`
        )
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

  useEffect(() => {
    if (formData.category_id && formData.subcategory_id) {
      axios
        .get(
          `http://localhost:3000/field-names/${formData.category_id}/${formData.subcategory_id}`
        )
        .then((response) => {
          if (response.data.length > 0 && response.data[0].document_fields) {
            const fieldsArray = response.data[0].document_fields
              .split(",")
              .map((field) => field.trim());
            setFieldNames(fieldsArray);
            setFormData((prev) => ({
              ...prev,
              document_fields: fieldsArray.reduce(
                (acc, field) => ({ ...acc, [field]: "" }),
                {}
              ),
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

  const handleFileUpload = (e, docName) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [docName]: file }));
      setFormData((prev) => ({
        ...prev,
        files: { ...prev.files, [docName]: file },
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData
    const formDataToSend = new FormData();

    // Add each field individually to FormData
    formDataToSend.append("user_id", formData.user_id.toString());
    formDataToSend.append("category_id", formData.category_id.toString());
    formDataToSend.append("subcategory_id", formData.subcategory_id.toString());
    formDataToSend.append("category_name", formData.category_name);
    formDataToSend.append("subcategory_name", formData.subcategory_name);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("document_fields", JSON.stringify(formData.document_fields));

    // Append files
    Object.entries(selectedFiles).forEach(([docName, file]) => {
      if (file && file instanceof File) {
        formDataToSend.append("files", file);
      }
    });

    try {
      console.log("Submitting form data...");

      const response = await axios.post(
        "http://localhost:3000/documents/upload",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload successful:", response.data);
      alert("Your application has been submitted successfully!");
    } catch (error) {
      console.error("Submission Error:", {
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
        status: error.response?.status
      });
      alert(`Failed to submit application: ${error.response?.data?.message || error.message}`);
    }
  };

  return (

    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Sidebar Placeholder */}
      <aside className="w-80 text-white p-6 hidden md:block ">
        {/* Sidebar content here */}
      </aside>
      <div className="flex-1 flex justify-center pt-9 bg-white items-center py-12 px-9">
        <form
          className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-5xl border border-gray-200"
          onSubmit={handleSubmit}
        >

          <h2 className="text-3xl font-bold text-center text-orange-600 mb-3 shadow-md pb-2 rounded-lg">
            Apply for Government Document
          </h2>

          <div className="grid grid-cols-3 gap-5 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold text-lg">
                Category
              </label>
              <input type="text" value={formData.category_name} readOnly className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-gray-100 shadow-md" />
            </div>

            <div>
              <label className="block text-gray-700 font-medium text-lg">
                Subcategory
              </label>
              <input type="text" value={formData.subcategory_name} readOnly className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-gray-100 shadow-md" />
            </div>

            <div >
              <label className="block text-gray-700 font-medium text-lg">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name || ""}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-gray-100 shadow-md"
                placeholder="Enter Full Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium text-lg">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email || ""}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 shadow-md"
                placeholder="Enter Email"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium text-lg">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                onChange={handleChange}
                value={formData.phone || ""}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 shadow-md"
                placeholder="Enter Phone Number"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium text-lg">
                Address
              </label>
              <textarea
                name="address"
                onChange={handleChange}
                value={formData.address || ""}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 shadow-md"
                placeholder="Enter Address"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold text-lg">
              Additional Fields
            </label>
            <div className="grid grid-cols-3 gap-6">
              {fieldNames.map((field, index) => (
                <div key={index} className="mt-2">
                  <label className="block text-gray-600 mb-1 font-medium">{field}</label>
                  <input
                    type="text"
                    value={formData.document_fields[field] || ""}
                    onChange={(e) => handleFieldChange(e, field)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-md"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold text-lg">Upload Documents</label>
            <div className="grid grid-cols-3 gap-6">
              {documentNames.map((docName, index) => (
                <div key={index} className="mb-2">
                  <label className="block text-gray-700 font-semibold">
                    {docName}
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, docName)}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-pointer focus:ring-2 focus:ring-blue-500 shadow-md"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold p-3 rounded-lg shadow-lg hover:bg-orange-700 transition-all text-lg"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Apply;
