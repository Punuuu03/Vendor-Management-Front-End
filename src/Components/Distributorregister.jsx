// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css"; // Ensure Tailwind & CSS are imported

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            if (!/^[0-9]*$/.test(value)) return; // Prevent non-numeric input
            if (value.length > 10) return; // Prevent more than 10 digits
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            ...formData,
            role: "Distributor", // Automatically set role as Distributor
            user_login_status: "Approve", // Default status for Distributors
        };

        try {
            const response = await fetch("https://vm.q1prh3wrjc0aw.ap-south-1.cs.amazonlightsail.com/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Registration Successful!");
                navigate("/Distributorlist"); // Redirect
            } else {
                alert(Registration`Failed: ${data.message}`);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 relative overflow-hidden">
            {/* Background Blur Effect */}
            <div className="absolute inset-0 bg-[url('https://source.unsplash.com/1600x900/?education')] bg-cover bg-center blur-md"></div>

            {/* Main Container */}
            <div className="relative z-10 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 w-[90%] max-w-3xl">
                <h2 className="text-2xl font-bold text-[#1e293b] text-center">Register</h2>
                <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-4">
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
                        pattern="\d{10}"
                        maxLength="10"
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#00234E] hover:bg-[#1e293b] text-white py-2 rounded"
                    >
                        Register
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Register;