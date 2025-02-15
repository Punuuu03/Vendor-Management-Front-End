import React from "react";
import "./Dashboardlanding.css"; // Custom CSS for animations

// Importing Icons/Images
import customerFormIcon from "../assets/lists.jpg";
import applicationFormIcon from "../assets/a.png";
import customersListIcon from "../assets/lists.jpg";
import applicationsListIcon from "../assets/app-list.jpg";

const DashboardLanding = () => {
  return (
    <div className="p-6  ml-0"> {/* Adjust margin for sidebar */}
      {/* Marquee Section */}
      <div className="overflow-hidden whitespace-nowrap  bg-orange-400 py-2">
        <div className="marquee text-white">
          <span>Welcome to the Vendor Management</span>
          <span>Welcome to the Vendor Management</span>
          <span>Welcome to the Vendor Management</span>
       
          
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[{
            title: "Process",
            link: "/process",
            icon: customerFormIcon
          }, {
            title: "Application Form",
            link: "/Category",
            icon: applicationFormIcon
          },  {
            title: "Application List",
            link: "/customerapply",
            icon: applicationsListIcon
          },{
            title: "Status",
            link: "/status",
            icon: customersListIcon
          },].map((item, index) => (
            <div key={index} className="text-center">
              <a href={item.link}>
                <img src={item.icon} alt={item.title} className="mx-auto w-36 h-36 object-cover rounded-md shadow-md" />
              </a>
              <p className="mt-2 text-sm font-semibold">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Records</h2>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-gray-800 text-white text-left">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Documents</th>
                <th className="px-4 py-2">Verification</th>
                <th className="px-4 py-2">Certificate</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "John Doe",
                  email: "john@example.com",
                  category: "Vendor",
                  phone: "123-456-7890",
                  address: "123 Main St, City",
                  documents: "Uploaded",
                  verification: "Pending",
                  certificate: "Not Issued"
                },
                {
                  name: "Jane Smith",
                  email: "jane@example.com",
                  category: "Supplier",
                  phone: "987-654-3210",
                  address: "456 Elm St, Town",
                  documents: "Verified",
                  verification: "Completed",
                  certificate: "Issued"
                },
                {
                  name: "Mike Johnson",
                  email: "mike@example.com",
                  category: "Retailer",
                  phone: "555-666-7777",
                  address: "789 Pine St, Village",
                  documents: "Uploaded",
                  verification: "In Progress",
                  certificate: "Not Issued"
                }
              ].map((record, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-4 py-2 border">{record.name}</td>
                  <td className="px-4 py-2 border">{record.email}</td>
                  <td className="px-4 py-2 border">{record.category}</td>
                  <td className="px-4 py-2 border">{record.phone}</td>
                  <td className="px-4 py-2 border">{record.address}</td>
                  <td className="px-4 py-2 border">{record.documents}</td>
                  <td className="px-4 py-2 border">{record.verification}</td>
                  <td className="px-4 py-2 border">{record.certificate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardLanding;
