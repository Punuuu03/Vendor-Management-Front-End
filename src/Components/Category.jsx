import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaIdCard,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaCar,
  FaPassport,
  FaUserGraduate,
  FaHome,
  FaBookOpen,
  FaBriefcase,
  FaShoppingCart,
} from "react-icons/fa";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const API_BASE_URL = "http://localhost:3000/categories";
  const SUBCATEGORIES_API_URL = "http://localhost:3000/subcategories";

  // Fetch Categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_BASE_URL);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Subcategories for a specific category
  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`${SUBCATEGORIES_API_URL}`);
      // Filter subcategories for the selected category
      const filteredSubcategories = response.data.filter(
        (sub) => sub.category.category_id === categoryId
      );
      setSubcategories(filteredSubcategories);
      setSelectedCategory(categoryId);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      {/* Header */}
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-4xl font-bold text-[#1e293b] mb-4">
          Government Document Services
        </h1>
        <p className="text-lg text-gray-600">
          Apply for various government documents quickly and hassle-free. Select
          a category below to proceed with your application.
        </p>
      </div>

      {/* Back Button (Visible only when showing subcategories) */}
      {selectedCategory && (
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSubcategories([]);
          }}
          className="mt-6 px-6 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition"
        >
          ← Back to Categories
        </button>
      )}

      {/* Category Grid */}
      {!selectedCategory ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6 mt-10">
          {categories.map((category) => (
            <div
              key={category.category_id}
              className="cursor-pointer bg-white text-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center border border-gray-300"
              onClick={() => fetchSubcategories(category.category_id)}
            >
              {/* Icon Placeholder */}
              <div className="text-6xl">{getCategoryIcon(category.category_name)}</div>
              <h3 className="text-2xl font-semibold mt-4">{category.category_name}</h3>
              <p className="mt-2 text-gray-700">
                Manage your {category.category_name} process.
              </p>
            </div>
          ))}
        </div>
      ) : (
        // Subcategories View
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6 mt-10">
          {subcategories.length > 0 ? (
            subcategories.map((sub) => (
              <div
                key={sub.subcategory_id}
                className="cursor-pointer bg-white text-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center border border-gray-300"
              >
                <h3 className="text-2xl font-semibold">{sub.subcategory_name}</h3>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-600">No subcategories found.</p>
          )}
        </div>
      )}
    </div>
  );
};

// Function to get category icons dynamically
const getCategoryIcon = (categoryName) => {
  const icons = {
    "Aadhar Card": <FaIdCard />,
    "PAN Card": <FaCreditCard />,
    "Income Certificate": <FaFileInvoiceDollar />,
    "Driving License": <FaCar />,
    "Passport": <FaPassport />,
    "Birth Certificate": <FaUserGraduate />,
    "Ration Card": <FaHome />,
    "Caste Certificate": <FaBookOpen />,
    "Employment Card": <FaBriefcase />,
    "Shop License": <FaShoppingCart />,
  };
  return icons[categoryName] || <FaFileInvoiceDollar />;
};

export default Categories;
