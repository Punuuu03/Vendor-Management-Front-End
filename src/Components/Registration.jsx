// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css"; // Ensure Tailwind & CSS are imported

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && (!/^\d*$/.test(value) || value.length > 10)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { ...formData, role: "Customer", user_login_status: "Approve" };
    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration Successful!");
        navigate("/");
      } else {
        alert(`Registration Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex w-3/5 bg-white rounded-lg shadow-xl overflow-hidden gap-6 p-6">
        {/* Left Column - Register Form */}
        <div className="w-2/5 p-6 flex flex-col justify-center bg-gray-100 shadow-lg">
          <h2 className="text-2xl text-[#1e293b] font-bold mb-4 text-center">Register</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone Number" className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required pattern="\d{10}" maxLength="10" />
            <button type="submit" className="w-full bg-[#00234E] hover:bg-[#1e293b] text-white py-2 rounded">Register</button>
          </form>
          <p className="mt-4 text-center">Already have an account? <Link to="/" className="text-[#1e293b] hover:underline">Login</Link></p>
        </div>

        {/* Right Column - Document List */}
        <div className="w-3/5 p-6 bg-gray-100 shadow-lg border border-gray-200 overflow-auto max-h-96">
          <h2 className="text-2xl text-[#00234E] font-bold mb-4 text-center">Government Document Services</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.category_id} className="flex items-center space-x-2 text-gray-700 border-b pb-1">
                <span className="text-black">⚫</span>
                <span>{category.category_name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
