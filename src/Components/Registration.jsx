import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css"; // Ensure Tailwind & CSS are imported

const imageUrl =
  "https://content.jdmagicbox.com/v2/comp/kolkata/b1/033pxx33.xx33.231201170458.u4b1/catalogue/bharatmala-seva-bharati-kolkata-81j6t16kev.jpg";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration Successful!");
    navigate("/");
  };

  const totalImages = 8;
  const radius = 130; // Slightly increased for spacing
  const images = Array.from({ length: totalImages });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex w-3/5 bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Left Column - Rotating Image Layout (Increased Width) */}
        <div className="w-3/5 hidden md:flex items-center justify-center bg-white relative">
          
          {/* Wrapper to Rotate All Images */}
          <div className="relative w-[450px] h-[450px] flex items-center justify-center rotate-container">
            {/* Center Image (Larger) */}
            <div className="absolute w-40 h-40 z-10">
              <img
                src={imageUrl}
                alt="Center Image"
                className="w-full h-full rounded-full object-cover border-4 border-blue-500"
              />
            </div>

            {/* Circular Rotating Images (Larger) */}
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

        {/* Right Column - Register Form (Reduced Width) */}
        <div className="w-3/5 p-6 flex flex-col justify-center">
          <h2 className="text-2xl text-[#1e293b] font-bold mb-4 text-center">Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
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
            
            {/* Role Selection */}
            <select
              name="role"
              className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="distributor">Distributor</option>
            </select>

            <button type="submit" className="w-full bg-[#1e293b] hover:bg-[#1e293b] text-white py-2 rounded">
              Register
            </button>
          </form>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/" className="text-[#1e293b] hover:underline">Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
