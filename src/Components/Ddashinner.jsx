import React from "react";
import "./Dashboardlanding.css"; // Custom CSS for animations

// Importing Icons/Images
import firstIcon from "../assets/cus.jpeg";
import secondIcon from "../assets/appform.png";
import thirdIcon from "../assets/cvimg.png";
import fourthIcon from "../assets/a.png";
import customerFormIcon from "../assets/lists.jpg";
import applicationFormIcon from "../assets/a.png";
import customersListIcon from "../assets/lists.jpg";
import applicationsListIcon from "../assets/app-list.jpg";

const DashboardLanding = () => {
  // Static Data
  const data = {
    totalCustomer: 1500,
    totalApplication: 2,
    OnlineFormSubmitted: 1,
    PendingApplication: 8,
  };

  return (
    <div className="p-6 ml-0"> {/* Adjust margin for sidebar */}
      {/* Marquee Section */}
      <div className="overflow-hidden whitespace-nowrap bg-gray-100 py-2">
        <div className="marquee">
          <span>Welcome to the Vendor Management</span>
          <span>Welcome to the Vendor Management</span>
          <span>Welcome to the Vendor Management</span>
        </div>
      </div>

      {/* Overview Section */}
      <div className="mt-5">
        <h2 className="text-2xl font-bold">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {/* Overview Cards */}
          {[{
            title: "Total Customers",
            count: data.totalCustomer,
            bgColor: "bg-red-200",
            iconBg: "bg-red-300",
            icon: firstIcon
          }, {
            title: "Today's Applications",
            count: data.totalApplication,
            bgColor: "bg-blue-200",
            iconBg: "bg-blue-300",
            icon: secondIcon
          }, {
            title: "Completed Applications",
            count: data.OnlineFormSubmitted,
            bgColor: "bg-green-200",
            iconBg: "bg-green-300",
            icon: thirdIcon
          }, {
            title: "Pending Applications",
            count: data.PendingApplication,
            bgColor: "bg-purple-200",
            iconBg: "bg-purple-300",
            icon: fourthIcon
          }].map((item, index) => (
            <div key={index} className={`${item.bgColor} p-3 rounded-lg shadow-md w-60`}> {/* Reduced width */}
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="text-md font-semibold">{item.title}</h5>
                  <h3 className="text-xl font-bold">{item.count}</h3>
                </div>
                <div className={`${item.iconBg} rounded-full w-12 h-12 flex items-center justify-center`}>
                  {item.icon ? <img src={item.icon} alt={item.title} className="w-8 h-8" /> : <i className={`${item.iconClass} text-white text-2xl`}></i>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[{
            title: "Customer Form",
            link: "/customers/create",
            icon: customerFormIcon
          }, {
            title: "Application Form",
            link: "/applications/create",
            icon: applicationFormIcon
          }, {
            title: "Customers List",
            link: "/customers",
            icon: customersListIcon
          }, {
            title: "Application List",
            link: "/applications",
            icon: applicationsListIcon
          }].map((item, index) => (
            <div key={index} className="text-center">
              <a href={item.link}>
                <img src={item.icon} alt={item.title} className="mx-auto w-36 h-36 object-cover rounded-md shadow-md" /> {/* Reduced image size */}
              </a>
              <p className="mt-2 text-sm font-semibold">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLanding;
