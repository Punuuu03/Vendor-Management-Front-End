import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaUserShield, FaFileAlt } from "react-icons/fa";

const Home = () => {
  return (
    <div className="bg-gray-100 text-[#1e293b] min-h-screen animate-fadeIn">
      {/* Hero Section */}
      <section className="bg-[#1e293b] text-white text-center py-16 shadow-md">
        <h1 className="text-4xl font-bold mb-4">Vendor Management System</h1>
        <p className="text-lg text-gray-300">
          Apply for government documents easily with our seamless process.
        </p>
        <Link to="/apply">
          <button className="mt-6 bg-white text-[#1e293b] px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300 hover:scale-105">
            Apply Now
          </button>
        </Link>
      </section>

      {/* Services Section */}
      <section className="py-12 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#1e293b]">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <ServiceCard
            icon={<FaFileAlt />}
            title="Aadhar Card"
            description="Apply for a new Aadhar Card or update details easily."
          />
          <ServiceCard
            icon={<FaUserShield />}
            title="PAN Card"
            description="Get your Permanent Account Number (PAN) hassle-free."
          />
          <ServiceCard
            icon={<FaCheckCircle />}
            title="Income Certificate"
            description="Apply for an Income Certificate for legal and financial purposes."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#1e293b] py-12 px-6 text-white">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-center">
          <ProcessStep step="1" title="Choose Category" description="Select the government document you need." />
          <ProcessStep step="2" title="Fill Form" description="Provide necessary details and upload documents." />
          <ProcessStep step="3" title="Submit & Get Updates" description="Track your application and receive updates." />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-white px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#1e293b]">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <Testimonial
            name="Rahul Sharma"
            feedback="The process was smooth and easy. Got my PAN card in just 5 days!"
            image="https://randomuser.me/api/portraits/men/32.jpg"
          />
          <Testimonial
            name="Priya Verma"
            feedback="Amazing service! Applied for an Aadhar card update and received it quickly."
            image="https://randomuser.me/api/portraits/women/44.jpg"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e293b] text-white text-center py-6 shadow-md">
        <p>© 2025 Vendor Management System | All Rights Reserved</p>
      </footer>
    </div>
  );
};

/* Service Card Component */
const ServiceCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300 hover:shadow-xl transition transform hover:scale-105 duration-300">
    <div className="text-[#1e293b] text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-[#1e293b]">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

/* Process Step Component */
const ProcessStep = ({ step, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 hover:shadow-xl transition transform hover:scale-105 duration-300">
    <div className="text-[#1e293b] text-3xl font-bold mb-2">Step {step}</div>
    <h3 className="text-xl font-semibold text-[#1e293b]">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

/* Testimonial Component */
const Testimonial = ({ name, feedback, image }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 hover:shadow-xl transition transform hover:scale-105 duration-300 flex items-center">
    <img src={image} alt={name} className="w-14 h-14 rounded-full mr-4 border-2 border-gray-300" />
    <div>
      <p className="text-gray-600 italic">"{feedback}"</p>
      <h3 className="mt-4 font-semibold text-[#1e293b]">{name}</h3>
    </div>
  </div>
);

export default Home;
