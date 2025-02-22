/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DistributorList = () => {
    const [distributors, setDistributors] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [updatedName, setUpdatedName] = useState("");
    const navigate = useNavigate(); // For navigation

    const apiUrl = "https://vm.q1prh3wrjc0aw.ap-south-1.cs.amazonlightsail.com/users/distributors";

    useEffect(() => {
        fetchDistributors();
    }, []);

    const fetchDistributors = async () => {
        try {
            const response = await axios.get(apiUrl);
            setDistributors(response.data);
        } catch (error) {
            console.error("Error fetching distributors:", error);
        }
    };

    const handleEditDistributor = (id, name) => {
        setEditingId(id);
        setUpdatedName(name);
    };

    const handleUpdateDistributor = async (id) => {
        try {
            await axios.patch(`${apiUrl}/${id}`, { name: updatedName });

            setDistributors(
                distributors.map((distributor) =>
                    distributor.user_id === id ? { ...distributor, name: updatedName } : distributor
                )
            );

            setEditingId(null);
            setUpdatedName("");

            Swal.fire("Updated", "Distributor updated successfully!", "success");
        } catch (error) {
            console.error("Error updating distributor:", error);
            Swal.fire("Error", "Failed to update distributor", "error");
        }
    };

    const handleDeleteDistributor = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "This distributor will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirmDelete.isConfirmed) {
            try {
                await axios.delete(`${apiUrl}/${id}`);
                setDistributors(distributors.filter((distributor) => distributor.user_id !== id));
                Swal.fire("Deleted!", "Distributor has been deleted.", "success");
            } catch (error) {
                console.error("Error deleting distributor:", error);
                Swal.fire("Error", "Failed to delete distributor", "error");
            }
        }
    };

    return (
        <div className="ml-[260px] flex flex-col items-center min-h-screen p-10 bg-gray-100">
            {/* Top Section - Heading & Add Distributor Button */}
            <div className="w-full max-w-7xl bg-white p-6 shadow-lg flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Manage Distributors</h2>
                <button
                    onClick={() => navigate("/Distributoregister")}
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600 transition duration-200"
                >
                    <FaPlus /> Add Distributor
                </button>
            </div>

            {/* Distributor List Section */}
            <div className="w-full max-w-7xl bg-white p-6 shadow-lg mt-6">
                <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Distributor List</h2>

                {/* Scrollable Table Wrapper */}
                <div className="overflow-y-auto max-h-60 border border-gray-300">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-300 text-black sticky top-0">
                            <tr>
                                <th className="p-3 text-left border-r border-gray-400">ID</th>
                                <th className="p-3 text-left border-r border-gray-400">Name</th>
                                <th className="p-3 text-left border-r border-gray-400">Email</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {distributors.length > 0 ? (
                                distributors.map((distributor, index) => (
                                    <tr key={distributor.user_id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                        <td className="p-3 border-r border-gray-400">{distributor.user_id}</td>
                                        <td className="p-3 border-r border-gray-400">
                                            {editingId === distributor.user_id ? (
                                                <input
                                                    type="text"
                                                    value={updatedName}
                                                    onChange={(e) => setUpdatedName(e.target.value)}
                                                    className="border border-gray-400 p-2 rounded"
                                                />
                                            ) : (
                                                distributor.name
                                            )}
                                        </td>
                                        <td className="p-3 border-r border-gray-400">{distributor.email}</td>
                                        <td className="p-3 text-center">
                                            {editingId === distributor.user_id ? (
                                                <button
                                                    onClick={() => handleUpdateDistributor(distributor.user_id)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleEditDistributor(distributor.user_id, distributor.name)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                                >
                                                    <FaEdit />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteDistributor(distributor.user_id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-3 text-center text-gray-500">
                                        No distributors found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DistributorList;
