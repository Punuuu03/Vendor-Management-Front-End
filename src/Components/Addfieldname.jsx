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

  // Fetch fields and categories
  useEffect(() => {
    fetchFields();
    fetchCategories();
  }, []);

  const fetchFields = async () => {
    try {
      const response = await axios.get("http://localhost:3000/field-names");
      setFields(response.data);
    } catch (error) {
      console.error("Error fetching field names:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) return;
    try {
      const response = await axios.get(`http://localhost:3000/subcategories/category/${categoryId}`);
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]); // Clear the list on error
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setFormData({ ...formData, category_id: selectedCategoryId, subcategory_id: "" });
    fetchSubcategories(selectedCategoryId);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/field-names/${id}`);
      Swal.fire("Deleted!", "Field Name deleted successfully", "success");
      fetchFields();
    } catch (error) {
      Swal.fire("Error!", "Failed to delete Field Name", "error");
    }
  };

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
    <div className="ml-[260px] flex flex-col items-center min-h-screen p-10 bg-gray-100">
      <div className="w-full p-6">
        <div className="w-full max-w-7xl bg-white p-6 shadow-lg">

          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">FeildNames List</h2>
          <button onClick={() => setModalOpen(true)} className="bg-[#00234E] text-white px-4 py-2 rounded">
            Add Field Names
          </button>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto" style={{ maxHeight: "450px", overflowY: "auto" }}>
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
                  <td className="border p-2 text-center">
                    <FaEdit onClick={() => handleEdit(field)} className="text-yellow-500 cursor-pointer mr-2" />
                    <FaTrash onClick={() => handleDelete(field.id)} className="text-red-500 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



        {/* Modal for Adding/Editing Fields */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">{editId ? "Edit Field Name" : "Add Field Name"}</h2>
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

                {/* Field Name Input */}
                <input
                  type="text"
                  className="w-full border p-2 mb-2"
                  value={formData.document_fields}
                  onChange={(e) => setFormData({ ...formData, document_fields: e.target.value })}
                  placeholder="Field Name"
                />

                <div className="flex justify-end">
                  <button type="submit" className="bg-[#00234E] text-white px-4 py-2 rounded">
                    {editId ? "Update" : "Add"} Field Name
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};




export default FieldNames;
// eslint-disable-next-line no-unused-vars
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const FieldNames = () => {
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [formData, setFormData] = useState({
//     category_id: "",
//     subcategory_id: "",
//     document_fields: "",
//   });

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/categories");
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const handleCategoryChange = async (e) => {
//     const selectedCategory = e.target.value;
//     setFormData({ ...formData, category_id: selectedCategory, subcategory_id: "" });

//     if (!selectedCategory) {
//       setSubcategories([]);
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:3000/subcategories/${selectedCategory}`);

//       if (Array.isArray(response.data)) {
//         setSubcategories(response.data);
//       } else {
//         console.error("Subcategories data is not an array:", response.data);
//         setSubcategories([]);
//       }
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//       setSubcategories([]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.category_id) {
//       alert("Please select a category.");
//       return;
//     }

//     if (!formData.subcategory_id) {
//       alert("Please select a subcategory.");
//       return;
//     }

//     if (!formData.document_fields.trim()) {
//       alert("Field Name cannot be empty.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:3000/field-names", {
//         category_id: formData.category_id,
//         subcategory_id: formData.subcategory_id,
//         document_fields: formData.document_fields.trim(),
//       });

//       console.log("API Response:", response.data);
//       alert("Field Name Added Successfully!");

//       setFormData({ category_id: "", subcategory_id: "", document_fields: "" });
//       setSubcategories([]); // Reset subcategories after submission
//     } catch (error) {
//       console.error("API Error:", error.response ? error.response.data : error.message);
//       alert("Error saving field name. Check server logs.");
//     }
//   };

//   return (
//     <div className="p-4">
//       <div className="max-w-md mx-auto bg-white p-6 shadow-lg rounded">
//         <h2 className="text-lg font-bold mb-4">Add Field Name</h2>
//         <form onSubmit={handleSubmit}>
//           {/* Category Dropdown */}
//           <select
//             className="w-full border p-2 mb-2"
//             value={formData.category_id}
//             onChange={handleCategoryChange}
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat.category_id} value={cat.category_id}>
//                 {cat.category_name}
//               </option>
//             ))}
//           </select>

//           {/* Subcategory Dropdown */}
//           <select
//             className="w-full border p-2 mb-2"
//             value={formData.subcategory_id}
//             onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
//             disabled={!formData.category_id}
//           >
//             <option value="">Select Subcategory</option>
//             {subcategories.length > 0 ? (
//               subcategories.map((sub) => (
//                 <option key={sub.subcategory_id} value={sub.subcategory_id}>
//                   {sub.subcategory_name}
//                 </option>
//               ))
//             ) : (
//               <option>No subcategories available</option>
//             )}
//           </select>

//           {/* Field Name Input */}
//           <input
//             type="text"
//             className="w-full border p-2 mb-2"
//             value={formData.document_fields}
//             onChange={(e) => setFormData({ ...formData, document_fields: e.target.value })}
//             placeholder="Field Name"
//           />

//           <div className="flex justify-end">
//             <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">
//               Add Field Name
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FieldNames;
