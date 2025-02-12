// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css"; // Ensure Tailwind & CSS are imported

const imageUrl =
  "https://content.jdmagicbox.com/v2/comp/kolkata/b1/033pxx33.xx33.231201170458.u4b1/catalogue/bharatmala-seva-bharati-kolkata-81j6t16kev.jpg";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Customer", // Default role is Customer
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Ensure phone number is only digits and max 10 characters
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return; // Prevent non-numeric input
      if (value.length > 10) return; // Prevent more than 10 digits
    }
  
    setFormData({ ...formData, [name]: value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.role,
      user_login_status: formData.role === "Distributor" ? "Reject" : "Approve", // Default status
    };

    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration Successful!");
        navigate("/"); // Redirect to login or homepage
      } else {
        alert(`Registration Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
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
              name="name"
              placeholder="Name"
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
            <input
  type="text"
  name="phone"
  placeholder="Phone Number"
  className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  onChange={handleChange}
  required
  pattern="\d{10}" // Enforces 10-digit number
  maxLength="10"
/>

            
            {/* Role Selection */}
            <select
              name="role"
              className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            >
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
              <option value="Distributor">Distributor</option>
            </select>

            <button type="submit" className="w-full bg-[#00234E] hover:bg-[#1e293b] text-white py-2 rounded">
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
