import React, { useState } from "react";

const distributors = ["Distributor A", "Distributor B", "Distributor C"]; // List of distributors

const VerifyDocuments = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      category: "Government ID",
      subcategory: "New Aadhar Card",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "9876543210",
      address: "123 Street, City, Country",
      documents: [
        { name: "Aadhar_Form.pdf", url: "https://www.example.com/Aadhar_Form.pdf" },
        { name: "ID_Proof.jpg", url: "https://www.example.com/ID_Proof.jpg" },
      ],
      status: "Pending",
      distributor: "", // Initially not assigned
    },
    {
      id: 2,
      category: "Tax Documents",
      subcategory: "PAN Correction",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      phone: "9123456789",
      address: "456 Avenue, City, Country",
      documents: [
        { name: "PAN_Update.pdf", url: "https://www.example.com/PAN_Update.pdf" },
      ],
      status: "Pending",
      distributor: "",
    },
    {
      id: 3,
      category: "Income Certificates",
      subcategory: "Renew Income Certificate",
      name: "Robert Brown",
      email: "robert.brown@example.com",
      phone: "9988776655",
      address: "789 Road, City, Country",
      documents: [
        { name: "Income_Certificate.pdf", url: "https://www.example.com/Income_Certificate.pdf" },
        { name: "Proof_of_Income.jpg", url: "https://www.example.com/Proof_of_Income.jpg" },
      ],
      status: "Pending",
      distributor: "",
    },
  ]);

  // Function to update status
  const updateStatus = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  // Function to assign a distributor
  const assignDistributor = (id, distributor) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, distributor } : app
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-0 px-2">
      <h2 className="text-2xl font-bold text-[#1e293b] mb-2">
        Verify Documents
      </h2>

      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 border border-gray-400 rounded-lg shadow-lg overflow-hidden">
          {/* Table Header */}
          <thead className="bg-gray-200 text-grey-400 text-sm">
            <tr>
              <th className="border border-gray-400 px-3 py-2 text-left">Category</th>
              <th className="border border-gray-400 px-3 py-2 text-left">Subcategory</th>
              <th className="border border-gray-400 px-3 py-2 text-left">Name</th>
              <th className="border border-gray-400 px-2 py-2 text-left w-32">Email</th>
              <th className="border border-gray-400 px-3 py-2 text-left">Phone</th>
              <th className="border border-gray-400 px-3 py-2 text-left">Address</th>
              <th className="border border-gray-400 px-3 py-2 text-left">Documents</th>
              <th className="border border-gray-400 px-3 py-2 text-left">Verification</th>
              <th className="border border-gray-400 px-3 py-2 text-left">Actions</th>
              <th className="border border-gray-400 px-3 py-2 text-left">Assign Distributor</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 text-sm">
            {applications.map((app) => (
              <tr
                key={app.id}
                className="bg-white hover:bg-gray-200 transition-all duration-200 border-b border-gray-400"
              >
                <td className="border border-gray-300 px-1 py-1 text-left break-words">{app.category}</td>
                <td className="border border-gray-300 px-3 py-2 text-left break-words">{app.subcategory}</td>
                <td className="border border-gray-300 px-3 py-2 text-left break-words">{app.name}</td>
                <td className="border border-gray-300 px-2 py-2 text-left break-words w-32">{app.email}</td>
                <td className="border border-gray-300 px-3 py-2 text-left break-words">{app.phone}</td>
                <td className="border border-gray-300 px-3 py-2 text-left break-words">{app.address}</td>
                <td className="border border-gray-300 px-3 py-2 text-left break-words">
                  {app.documents.map((doc, index) => (
                    <div key={index} className="mt-1">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {doc.name}
                      </a>
                    </div>
                  ))}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <span
                    className={`px-3 py-1 rounded-lg text-white text-xs ${
                      app.status === "Approved"
                        ? "bg-green-600"
                        : app.status === "Rejected"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center flex flex-col space-y-2">
                  <button
                    onClick={() => updateStatus(app.id, "Approved")}
                    className="bg-green-500 text-white px-3 py-1 text-xs rounded-lg hover:bg-green-700 transition-all duration-300"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(app.id, "Rejected")}
                    className="bg-red-500 text-white px-3 py-1 text-xs rounded-lg hover:bg-red-700 transition-all duration-300"
                  >
                    Reject
                  </button>
                </td>
                {/* Assign Distributor Dropdown */}
                <td className="border border-gray-300 px-3 py-2 text-center">
                  {app.status === "Approved" ? (
                    <select
                      value={app.distributor}
                      onChange={(e) => assignDistributor(app.id, e.target.value)}
                      className="border border-gray-400 p-1 rounded text-sm"
                    >
                      <option value="">Select Distributor</option>
                      {distributors.map((dist, index) => (
                        <option key={index} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-gray-500 text-xs">Waiting for Approval</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerifyDocuments;
