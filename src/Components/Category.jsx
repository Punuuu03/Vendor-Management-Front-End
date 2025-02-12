import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Importing images
import AadharCardImg from "../assets/adhar.png";
import PANCardImg from "../assets/adhar.png";
import IncomeCertificateImg from "../assets/adhar.png";
import DrivingLicenseImg from "../assets/adhar.png";
import PassportImg from "../assets/adhar.png";
import BirthCertificateImg from "../assets/adhar.png";
import RationCardImg from "../assets/adhar.png";
import CasteCertificateImg from "../assets/adhar.png";
import EmploymentCardImg from "../assets/adhar.png";
import ShopLicenseImg from "../assets/adhar.png";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const API_BASE_URL = "http://localhost:3000/categories";
  const SUBCATEGORIES_API_URL = "http://localhost:3000/subcategories";

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

  const fetchSubcategories = async (categoryId, categoryName) => {
    try {
      const response = await axios.get(SUBCATEGORIES_API_URL);
      const filteredSubcategories = response.data.filter(
        (sub) => sub.category.category_id === categoryId
      );
      setSubcategories(filteredSubcategories);
      setSelectedCategory({ categoryId, categoryName });
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleSubcategorySelect = (subcategoryId, subcategoryName, categoryId, categoryName) => {
    navigate("/Apply", {
      state: { categoryId, categoryName, subcategoryId, subcategoryName },
    });
  };

  return (
    <div className="bg-gray-100 text-[#1e293b] min-h-screen animate-fadeIn">
      <section className="relative bg-[#1e293b] text-white py-16 px-6 text-center shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Government Document Services</h1>
          <p className="text-lg text-gray-300">
            Apply for various government documents quickly and hassle-free. Select a category below to proceed with your application.
          </p>
        </div>
      </section>

      <div className="flex justify-center  mt-6">
        {selectedCategory ? (
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSubcategories([]);
            }}
            className="px-6 py-2  bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition"
          >
            ← Back to Categories
          </button>
        ) : (
          <button
            className="px-6 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
          >
            Categories →
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto px-6 mt-10">
        {!selectedCategory ? (
          categories.map((category, index) => (
            <div
              key={category.category_id}
              className="cursor-pointer bg-white text-gray-800 p-6 w-full rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center border border-gray-300"
              onClick={() => fetchSubcategories(category.category_id, category.category_name)}
            >
              <img src={getCategoryImage(index)} alt={category.category_name} className="w-[120px] h-[120px] mb-4" />
              <h3 className="text-lg font-semibold text-center break-words w-full">{category.category_name}</h3>
              <p className="mt-2 text-gray-700 text-center text-sm break-words w-full">Manage your {category.category_name} process.</p>
            </div>
          ))
        ) : (
          subcategories.length > 0 ? (
            subcategories.map((sub) => (
              <div
                key={sub.subcategory_id}
                className="cursor-pointer bg-white text-gray-800 p-6 w-full rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center border border-gray-300"
                onClick={() => handleSubcategorySelect(sub.subcategory_id, sub.subcategory_name, selectedCategory.categoryId, selectedCategory.categoryName)}
              >
                <img src={getCategoryImage(categories.findIndex(cat => cat.category_id === selectedCategory.categoryId))} alt={sub.subcategory_name} className="w-[120px] h-[120px] mb-4" />
                <h3 className="text-lg font-semibold text-center break-words w-full">{sub.subcategory_name}</h3>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-600 text-center w-full">No subcategories found.</p>
          )
        )}
      </div>
    </div>
  );
};

const categoryImages = [
  AadharCardImg,
  PANCardImg,
  IncomeCertificateImg,
  DrivingLicenseImg,
  PassportImg,
  BirthCertificateImg,
  RationCardImg,
  CasteCertificateImg,
  EmploymentCardImg,
  ShopLicenseImg,
];

const getCategoryImage = (index) => {
  return categoryImages[index % categoryImages.length];
};

export default Categories;
