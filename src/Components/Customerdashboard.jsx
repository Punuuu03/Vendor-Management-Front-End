import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ children }) => {
  const [userEmail] = useState("customer@example.com"); // Replace with actual user email
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#1e293b] text-white py-4 px-6 flex justify-between items-center shadow-md">
        {/* Left: Logo with Image */}
        <div className="flex items-center space-x-3">
          <img
            src="https://content.jdmagicbox.com/v2/comp/kolkata/b1/033pxx33.xx33.231201170458.u4b1/catalogue/bharatmala-seva-bharati-kolkata-81j6t16kev.jpg"
            alt="Logo"
            className="w-10 h-10 rounded-full"
          />
          <h1 className="text-2xl font-bold">Vendor Management</h1>
        </div>

        {/* Right: Navigation Links & Profile Dropdown */}
        <div className="flex items-center space-x-6">
          <ul className="flex space-x-6">
            <li><Link to="/Home" className="hover:underline">Home</Link></li>
            <li><Link to="/About" className="hover:underline">About</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/Category" className="hover:underline">Category</Link></li>
            <li><Link to="/Customerapply" className="hover:underline">Applications</Link></li>
          </ul>

          {/* Profile Dropdown */}
          <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 focus:outline-none">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="User Icon"
                className="w-10 h-10 rounded-full"
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md overflow-hidden">
                <div className="px-4 py-2">{userEmail}</div>
                <hr />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Navbar;
