import React from "react";
import { useNavigate } from "react-router-dom";
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

  // List of Categories
  const categories = [
    {
      name: "Aadhar Card",
      description: "Apply or update your Aadhar details easily.",
      icon: <FaIdCard />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      name: "PAN Card",
      description: "Get a new PAN card or correct existing details.",
      icon: <FaCreditCard />,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      name: "Income Certificate",
      description: "Apply for an income certificate for financial purposes.",
      icon: <FaFileInvoiceDollar />,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      name: "Driving License",
      description: "Apply for a new driving license or renew your existing one.",
      icon: <FaCar />,
      bgColor: "bg-red-100",
      textColor: "text-red-600",
    },
    {
      name: "Passport",
      description: "Apply for a new passport or renew your expired one.",
      icon: <FaPassport />,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      name: "Birth Certificate",
      description: "Register a new birth certificate online.",
      icon: <FaUserGraduate />,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
    {
      name: "Ration Card",
      description: "Apply for a new ration card or update family details.",
      icon: <FaHome />,
      bgColor: "bg-pink-100",
      textColor: "text-pink-600",
    },
    {
      name: "Caste Certificate",
      description: "Obtain a caste certificate for government benefits.",
      icon: <FaBookOpen />,
      bgColor: "bg-teal-100",
      textColor: "text-teal-600",
    },
    {
      name: "Employment Card",
      description: "Get your employment card for job applications.",
      icon: <FaBriefcase />,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
    },
    {
      name: "Shop License",
      description: "Register your shop with a government license.",
      icon: <FaShoppingCart />,
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
    },
  ];

  // Handle Category Click with Navigation Confirmation
//   const navigate = useNavigate();
  const handleCategoryClick = (category) => {
    navigate("/Apply", { state: { category } }); // Ensure "/apply" (lowercase)
  };
  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      {/* Introduction Section */}
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-4xl font-bold text-[#1e293b] mb-4">
          Government Document Services
        </h1>
        <p className="text-lg text-gray-600">
          Apply for various government documents quickly and hassle-free. Select a category below to proceed with your application.
        </p>
      </div>

      {/* Category Cards Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6 mt-10">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category.name)}
            className={`cursor-pointer ${category.bgColor} ${category.textColor} p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center border border-gray-300`}
          >
            <div className="text-6xl">{category.icon}</div>
            <h3 className="text-2xl font-semibold mt-4">{category.name}</h3>
            <p className="mt-2 text-gray-700">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
