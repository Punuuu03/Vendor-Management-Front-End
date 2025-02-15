// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css"; // Ensure Tailwind & CSS are imported

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
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
    setError("");
    try {
      const response = await fetch("http://localhost:3000/users/login", {
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

      if (data.role === "Admin") navigate("/Adashinner");
      else if (data.role === "Customer") navigate("/Cdashinner");
      else if (data.role === "Distributor") navigate("/Ddashinner");
      else alert("Invalid role received");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex w-3/5 bg-white rounded-lg shadow-xl overflow-hidden gap-6 p-6">
        {/* Left Column - Login Form */}
        <div className="w-2/5 p-6 flex flex-col justify-center bg-gray-100 shadow-lg">
          <h2 className="text-2xl text-[#1e293b] font-bold mb-4 text-center">Login</h2>
          {error && <p className="text-red-500 text-center mb-3">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-[#00234E] text-white p-2 rounded hover:bg-[#1e293b] transition"
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
        <div className="w-3/5 p-6 bg-gray-100 shadow-lg border border-gray-200 overflow-y-auto max-h-96">
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

export default Login;
