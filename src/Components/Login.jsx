// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../index.css"; // Ensure Tailwind & CSS are imported

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://vm.q1prh3wrjc0aw.ap-south-1.cs.amazonlightsail.com/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://vm.q1prh3wrjc0aw.ap-south-1.cs.amazonlightsail.com/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      Swal.fire({
        title: "Login Successful!",
        text: "Redirecting...",
        icon: "success",
        confirmButtonColor: "#00234E",
      }).then(() => {
        if (data.role === "Admin") navigate("/Adashinner");
        else if (data.role === "Customer") navigate("/Cdashinner");
        else if (data.role === "Distributor") navigate("/Ddashinner");
        else Swal.fire("Error", "Invalid role received", "error");
      });
    } catch (error) {
      Swal.fire({
        title: "Login Failed",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center before:absolute before:inset-0"
        style={{
          backgroundImage: "url('https://web.edcrib.com/updates/wp-content/uploads/2024/08/edcrib-blog1-1024x683.jpeg')",
        }}
      />

      <div className="relative flex w-3/4 h-[75vh] bg-white bg-opacity-80 rounded-lg shadow-xl overflow-hidden gap-8 p-8">
        {/* Left Column - Login Form */}
        <div className="w-2/5 p-8 flex flex-col justify-center bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl text-[#1e293b] font-bold mb-4 text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full mb-3 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full mb-3 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-[#00234E] text-white p-3 rounded hover:bg-[#1e293b] transition"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/registration" className="text-[#1e293b] hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Right Column - Dynamic Category List */}
        <div className="w-3/5 p-8 bg-white shadow-lg border border-gray-200 overflow-y-auto max-h-[80vh] rounded-lg">
          <h2 className="text-2xl text-[#00234E] font-bold mb-4 text-center">
            Government Document Services
          </h2>
          <ul className="grid grid-cols-2 gap-6">
            {categories.map((category) => (
              <li
                key={category.category_id}
                className="flex items-center space-x-2 text-gray-700 border-b pb-2"
              >
                <span className="text-black text-sm">⚫</span>
                <span>{category.category_name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
