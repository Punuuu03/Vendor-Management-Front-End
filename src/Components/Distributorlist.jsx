import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DistributorList = () => {
    const [distributors, setDistributors] = useState([]);

    // Fetch data from the API
    useEffect(() => {
        axios.get('http://localhost:3000/users/distributors')
            .then(response => {
                setDistributors(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    }, []);

    // Handle status update
    const updateStatus = (userId, status) => {
        axios.patch(`http://localhost:3000/users/status/${userId}`, { status })
            .then(response => {
                if (response.data === "User status updated to " + status) {
                    // Update the local state to reflect the status change
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
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">Distributor List</h1>
            <table className="min-w-full  bg-white border border-gray-300 rounded-lg shadow-md">
                <thead className="bg-gray-800">
                    <tr>
                        <th className="px-4 py-4 text-left text-sm font-medium text-white border-r border-gray-300">User ID</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-white border-r border-gray-300">Name</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-white border-r border-gray-300">Email</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-white border-r border-gray-300">Phone</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-white border-r border-gray-300">Role</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-white border-r border-gray-300">Status</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-white">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {distributors.map((distributor, index) => (
                        <tr 
                            key={distributor.user_id} 
                            className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}`}
                        >
                            <td className="px-4 py-2 text-sm text-gray-800 border-r border-gray-300">{distributor.user_id}</td>
                            <td className="px-4 py-2 text-sm text-gray-800 border-r border-gray-300">{distributor.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-800 border-r border-gray-300">{distributor.email}</td>
                            <td className="px-4 py-2 text-sm text-gray-800 border-r border-gray-300">{distributor.phone}</td>
                            <td className="px-4 py-2 text-sm text-gray-800 border-r border-gray-300">{distributor.role}</td>
                            <td className="px-4 py-2 text-sm text-gray-800 border-r border-gray-300">
                                <span
                                    className={`px-2 py-1 rounded-full text-white ${distributor.user_login_status === 'Approve' ? 'bg-green-500' : 'bg-red-500'}`}
                                >
                                    {distributor.user_login_status}
                                </span>
                            </td>
                            <td className="px-4 py-2 text-sm">
                                <button
                                    onClick={() => updateStatus(distributor.user_id, 'Approve')}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600"
                                >
                                    <i className="fas fa-check-circle mr-2"></i> Approve
                                </button>
                                <button
                                    onClick={() => updateStatus(distributor.user_id, 'Reject')}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                >
                                    <i className="fas fa-times-circle mr-2"></i> Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DistributorList;
