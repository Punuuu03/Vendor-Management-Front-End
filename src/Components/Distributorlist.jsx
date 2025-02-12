// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const DistributorList = () => {
    const [distributors, setDistributors] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/users/distributors")
            .then(response => {
                setDistributors(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    }, []);

    const updateStatus = (userId, status) => {
        axios.patch(`http://localhost:3000/users/status/${userId}`, { status })
            .then(response => {
                if (response.data === "User status updated to " + status) {
                    setDistributors(distributors.map(distributor => 
                        distributor.user_id === userId ? { ...distributor, user_login_status: status } : distributor
                    ));
                }
            })
            .catch(error => {
                console.error("Error updating status!", error);
            });
    };

    return (
        <div className="container bg-white mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Distributor List</h1>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-300 sticky top-0">
                        <tr>
                            <th className="border p-2">User ID</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Phone</th>
                            <th className="border p-2">Role</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {distributors.map((distributor, index) => (
                            <tr key={distributor.user_id} className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}>
                                <td className="border p-2">{distributor.user_id}</td>
                                <td className="border p-2">{distributor.name}</td>
                                <td className="border p-2">{distributor.email}</td>
                                <td className="border p-2">{distributor.phone}</td>
                                <td className="border p-2">{distributor.role}</td>
                                <td className="border p-2">
                                    <span className={`px-2 py-1 rounded-full text-white ${distributor.user_login_status === 'Approve' ? 'bg-green-500' : 'bg-red-500'}`}> 
                                        {distributor.user_login_status} 
                                    </span>
                                </td>
                                <td className="border p-2 flex gap-2">
                                    <button onClick={() => updateStatus(distributor.user_id, 'Approve')} className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-600">
                                        <FaCheckCircle /> Approve
                                    </button>
                                    <button onClick={() => updateStatus(distributor.user_id, 'Reject')} className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-600">
                                        <FaTimesCircle /> Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DistributorList;
