/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// import AdminDashboard from "./AdminDashboard"; // Importing AdminDashboard

import usersIcon from "../assets/Login.png";
import revenueIcon from "../assets/Login.png";
import subscriptionsIcon from "../assets/Login.png";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Adashinner = () => {
  // Line chart data
  const userActivityData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Active Users",
        data: [120, 200, 150, 300, 250, 400],
        borderColor: "blue",
        fill: false,
      },
    ],
  };

  // Bar chart data
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Requests",
        data: [100, 150, 200, 250, 300, 350],
        backgroundColor: "rgb(187, 247, 208)",
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar & Dashboard */}
      {/* <AdminDashboard /> */}

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Vendors Card */}
          <div className="bg-green-200 p-4 rounded shadow flex items-center">
            <img src={revenueIcon} alt="Revenue" className="w-12 h-12 mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Vendors</h2>
              <p className="text-xl">₹2058</p>
            </div>
          </div>

          {/* Total Transactions Card */}
          <div className="bg-yellow-200 p-4 rounded shadow flex items-center">
            <img src={subscriptionsIcon} alt="Transactions" className="w-12 h-12 mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Transactions</h2>
              <p className="text-xl">398</p>
            </div>
          </div>

          {/* Total Categories Card */}
          <div className="bg-blue-200 p-4 rounded shadow flex items-center">
            <img src={usersIcon} alt="Categories" className="w-12 h-12 mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Categories</h2>
              <p className="text-xl">5032</p>
            </div>
          </div>

          {/* Total Subcategories Card */}
          <div className="bg-green-200 p-4 rounded shadow flex items-center">
            <img src={revenueIcon} alt="Subcategories" className="w-12 h-12 mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Subcategories</h2>
              <p className="text-xl">₹2058</p>
            </div>
          </div>

          {/* Total Users Card */}
          <div className="bg-blue-200 p-4 rounded shadow flex items-center">
            <img src={usersIcon} alt="Users" className="w-12 h-12 mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-xl">5032</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">User Activity</h2>
            <Line data={userActivityData} />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Vendor Data</h2>
            <Bar data={salesData} />
          </div>
        </div>

        {/* Customer Summary Table */}
        <div className="bg-white p-4 rounded shadow mt-6">
          <h2 className="text-xl font-semibold">Customer Summary</h2>
          <table className="min-w-full mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Subscription</th>
              </tr>
            </thead>
            <tbody>
              {["John Doe", "Jane Smith", "Michael Johnson"].map((name, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{name}</td>
                  <td className="p-2">{`${name.toLowerCase().replace(" ", "")}@example.com`}</td>
                  <td className="p-2">123-456-7890</td>
                  <td className="p-2">{index % 2 === 0 ? "Basic" : "Premium"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Adashinner;
