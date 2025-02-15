/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { 
  FaHourglassHalf, FaCheckCircle, FaTimesCircle, 
  FaShoppingBag, FaFileDownload 
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const Adashinner = () => {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New PAN Process",
        data: [10, 20, 30, 40, 50, 60],
        borderColor: "red",
        fill: false,
      },
      {
        label: "CSF PAN Process",
        data: [5, 15, 25, 35, 45, 55],
        borderColor: "green",
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Card Items */}
        {[
          { title: "New Aadhar Process", color: "orange", icon: FaHourglassHalf },
          { title: "PAN Process", color: "orange", icon: FaHourglassHalf },
          { title: "New PAN Objection", color: "red", icon: FaTimesCircle },
          { title: "Cast Certificate", color: "orange", icon: FaTimesCircle },
          { title: "Cast Validity", color: "green", icon: FaCheckCircle },
          { title: "Birth Certificate", color: "green", icon: FaCheckCircle },
          { title: "Complaint Pending", color: "gray", icon: FaShoppingBag },
          { title: "Download Certificate", color: "blue", icon: FaFileDownload, text: "Click Here" },
        ].map(({ title, color, icon: Icon, text }, index) => (
          <div key={index} className={`flex items-center bg-${color}-200 p-4 rounded shadow`}>
            <div className={`bg-${color}-500 text-white p-3 rounded`}>
              <Icon size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              {text ? (
                <p className="text-blue-600 font-semibold cursor-pointer">{text}</p>
              ) : (
                <p className="text-xl">10</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Graph & Table Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Documents Process Statistics</h2>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
{/* Customer Summary Table */}
<div className="bg-white p-4 rounded shadow overflow-hidden">
  <h2 className="text-xl font-semibold">Customer Summary</h2>
  <div className="overflow-y-auto max-h-64">
    <table className="min-w-full mt-4 border-collapse">
      <thead className="sticky top-0 bg-gray-200">
        <tr>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Phone</th>
          <th className="p-2 border">Category</th>
          <th className="p-2 border">Documents</th>
        </tr>
      </thead>
      <tbody>
        {[
          { name: "John Doe", category: "Business", docs: "ID Proof" },
          { name: "Jane Smith", category: "Individual", docs: "Passport" },
          { name: "Michael Johnson", category: "Corporate", docs: "License" },
          { name: "Sarah Lee", category: "Freelancer", docs: "PAN Card" },
          { name: "Chris Martin", category: "Startup", docs: "Tax Documents" }
        ].map((customer, index) => (
          <tr
            key={index}
            className={`border ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
          >
            <td className="p-2">{customer.name}</td>
            <td className="p-2">{`${customer.name.toLowerCase().replace(" ", "")}@example.com`}</td>
            <td className="p-2">123-456-7890</td>
            <td className="p-2">{customer.category}</td>
            <td className="p-2">{customer.docs}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        </div>
      </div>
   
  );
};

export default Adashinner;