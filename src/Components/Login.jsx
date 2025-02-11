import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css"; // Ensure Tailwind & CSS are imported

const imageUrl =
  "https://content.jdmagicbox.com/v2/comp/kolkata/b1/033pxx33.xx33.231201170458.u4b1/catalogue/bharatmala-seva-bharati-kolkata-81j6t16kev.jpg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "", role: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      console.log("Token:", data.token); // Print token to console

      const { role } = formData;
      if (role === "admin") navigate("/Adashinner");
      else if (role === "customer") navigate("/Home");
      else if (role === "distributor") navigate("/Distributordashboard");
      else alert("Please select a valid role");
    } catch (error) {
      setError(error.message);
    }
  };

  const totalImages = 8;
  const radius = 130; // Adjusted for spacing
  const images = Array.from({ length: totalImages });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex w-3/5 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Column - Rotating Image Layout */}
        <div className="w-3/5 hidden md:flex items-center justify-center bg-white relative">
          <div className="relative w-[450px] h-[450px] flex items-center justify-center rotate-container">
            <div className="absolute w-40 h-40 z-10">
              <img
                src={imageUrl}
                alt="Center Image"
                className="w-full h-full rounded-full object-cover border-4 border-blue-500"
              />
            </div>
            {images.map((_, index) => {
              const angle = (index / totalImages) * (2 * Math.PI);
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);
              return (
                <div
                  key={index}
                  className="absolute w-36 h-36 rotating-image"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Rotating Image ${index + 1}`}
                    className="w-full h-full rounded-full object-cover border-2 border-blue-300"
                  />
                </div>
              );
            })}
          </div>
        </div>
        {/* Right Column - Login Form */}
        <div className="w-3/5 p-6 flex flex-col justify-center">
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
            <select
              name="role"
              className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="distributor">Distributor</option>
            </select>
            <button type="submit" className="w-full bg-[#1e293b] hover:bg-[#1e293b] text-white py-2 rounded">
              Login
            </button>
          </form>
          <p className="mt-4 text-center">
            Don't have an account? <Link to="/registration" className="text-[#1e293b] hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
