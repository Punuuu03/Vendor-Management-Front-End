import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
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
        setCategoryData(res.data.map(item => ({
          name: item.category,
          value: item.totalApplications
        })));
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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

  return (
    <div className="ml-72 mt-14 p-6">
      {/* Top Cards */}
      <motion.div 
        className="grid grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
      >
        {[
          { icon: <FaClipboardList size={40} />, count: appliedCount, label: "Total Applied", color: "bg-blue-500", onClick: () => navigate('/customerapply') },
          { icon: <FaCheckCircle size={40} />, count: completedCount, label: "Total Completed", color: "bg-green-500", onClick: () => navigate('/Usercompletedlist') },
          { icon: <FaRupeeSign size={40} />, count: `₹${appliedCount * 150}`, label: "Total Transaction", color: "bg-purple-500" },
          { icon: <FaClock size={40} />, count: Math.max(appliedCount - completedCount, 0), label: "Pending Applications", color: "bg-yellow-500", onClick: () => navigate('/Userpendinglist') }
        ].map((item, index) => (
          <div 
            key={index} 
            className={`${item.color} text-white p-6 rounded-xl shadow-lg text-center hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2`} 
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
        <div className="w-1/2 bg-white shadow-xl border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Application Status Overview</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" barSize={35} /> {/* Reduced bar size */}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Container */}
        <div className="w-1/2 bg-white shadow-xl border rounded-xl p-6 flex items-center justify-center">
          <h2 className="absolute text-xl font-semibold -mt-60">Category Distribution</h2>
          {categoryData.length > 0 ? (
            <PieChart width={400} height={400}>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ x, y, name }) => (
                  <text x={x} y={y - 10} textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                    {name}
                  </text>
                )}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
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
