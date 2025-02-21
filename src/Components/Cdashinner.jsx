import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaClipboardList, FaCheckCircle, FaRupeeSign, FaClock } from "react-icons/fa";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [appliedCount, setAppliedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.user_id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:3000/userdashboard/total-applied/${userId}`)
      .then(res => setAppliedCount(res.data.totalCount))
      .catch(err => console.error("Error fetching total applied:", err));

    axios.get(`http://localhost:3000/userdashboard/total-completed/${userId}`)
      .then(res => setCompletedCount(res.data.totalCompleted))
      .catch(err => console.error("Error fetching total completed:", err));

    axios.get(`http://localhost:3000/userdashboard/category-counts/${userId}`)
      .then(res => {
        const dataWithColors = res.data.map((item, index) => ({
          name: item.category,
          value: item.totalApplications,
          color: generateColor(index), // Assign dynamic color
        }));
        setCategoryData(dataWithColors);
      })
      .catch(err => console.error("Error fetching category data:", err));

    axios.get(`http://localhost:3000/userdashboard/status-count/${userId}`)
      .then(res => {
        const formattedData = res.data.map(item => ({
          status: item.status,
          count: parseInt(item.count),
        }));
        setStatusData(formattedData);
      })
      .catch(err => console.error("Error fetching status counts:", err));
  }, [userId]);

  // Function to generate dynamic colors
  const generateColor = (index) => {
    const hue = (index * 137.508) % 360; // Distribute colors around the hue circle
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <div className="ml-80 mt-14 p-6">
      {/* Top Cards */}
      <motion.div 
        className="grid grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
      >
        {[
          { icon: <FaClipboardList size={40} />, count: appliedCount, label: "Total Applied", color: "bg-blue-300", onClick: () => navigate('/customerapply') },
          { icon: <FaCheckCircle size={40} />, count: completedCount, label: "Total Completed", color: "bg-green-300", onClick: () => navigate('/Usercompletedlist') },
          { icon: <FaRupeeSign size={40} />, count: `₹${appliedCount * 150}`, label: "Total Transaction", color: "bg-purple-300" },
          { icon: <FaClock size={40} />, count: Math.max(appliedCount - completedCount, 0), label: "Pending Applications", color: "bg-yellow-300", onClick: () => navigate('/Userpendinglist') }
        ].map((item, index) => (
          <div 
            key={index} 
            className={`${item.color} text-gray-800 p-6 rounded-xl shadow-md text-center hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2`} 
            onClick={item.onClick}
          > 
            {item.icon}
            <h3 className="text-2xl font-bold">{item.count}</h3>
            <p className="text-lg">{item.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="flex gap-6">
        {/* Bar Chart Container */}
        <div className="w-1/2 bg-white shadow-md border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Application Status Overview</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#EA580C" barSize={40}>
                <LabelList dataKey="count" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Container */}
        <div className="w-1/2 bg-white shadow-md border rounded-xl p-6 flex flex-col items-center justify-center relative">
          <h2 className="text-xl text-black mb-4 font-bold">Category Distribution</h2>

          {categoryData.length > 0 ? (
            <PieChart width={430} height={400}>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          ) : (
            <p className="text-lg font-semibold text-gray-500 text-center">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
