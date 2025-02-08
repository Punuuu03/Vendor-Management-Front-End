/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaList,
  FaUserShield,
  FaFileAlt,
  FaTasks,
  FaExchangeAlt,
  FaSignOutAlt,
  FaCalendarAlt
} from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar styles

const Sidebar = ({ onNavigate }) => {
  const [activePath, setActivePath] = useState("/");

  const handleNavigation = (path) => {
    setActivePath(path);
    onNavigate(path);
  };

  return (
    <div className="w-1/5 bg-[#1e293b] text-white shadow-lg p-4 min-h-screen">
      <div className="flex items-center mb-6">
        <img
          src="https://content.jdmagicbox.com/v2/comp/kolkata/b1/033pxx33.xx33.231201170458.u4b1/catalogue/bharatmala-seva-bharati-kolkata-81j6t16kev.jpg"
          alt="Logo"
          className="h-12 w-12 mr-3 rounded-full"
        />
        <h1 className="text-xl font-bold">Vendor Management</h1>
      </div>
      <nav className="mt-6">
        <ul>
          {[
            { icon: <FaPlus />, label: "Add Category", path: "/Addcategory" },
            { icon: <FaList />, label: "Subcategory", path: "/subcategory" },
            { icon: <FaUserShield />, label: "Distributor Credentials", path: "/distributor-credentials" },
            { icon: <FaExchangeAlt />, label: "Transaction", path: "/transactions" },
            { icon: <FaFileAlt />, label: "Verify Documents", path: "/Verifydocuments" },
            { icon: <FaTasks />, label: "Distributor Assign", path: "/distributor-assign" },
          ].map((item, index) => (
            <li
              key={index}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-300 ease-in-out mb-4 shadow-md ${
                activePath === item.path ? "bg-white text-black border-l-4 border-blue-500" : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const AdminDashboard = ({ children }) => {
  const [user, setUser] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const email = localStorage.getItem("userEmail");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar onNavigate={(path) => navigate(path)} />
      <div className="flex-1 p-6">
        {/* Top Section */}
        <div className="flex items-center justify-between bg-[#334155] text-white p-4 rounded-md shadow-md">
          <span className="text-lg font-bold">Admin Dashboard</span>

          {/* Profile Section */}
          <div className="relative">
            <img
              src="https://t4.ftcdn.net/jpg/04/83/90/95/360_F_483909569_OI4LKNeFgHwvvVju60fejLd9gj43dIcd.jpg"
              alt="Profile"
              className="h-10 w-10 rounded-full cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                <div className="p-4 border-b">
                  {userEmail ? (
                    <p className="text-lg mb-4"><strong>{userEmail}</strong></p>
                  ) : (
                    <p className="text-lg mb-4">No user logged in.</p>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Render children here */}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
