import React from "react";
import { FaUsers, FaShieldAlt, FaClock, FaCheckCircle } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-gray-100 text-[#1e293b] min-h-screen animate-fadeIn">
      {/* Hero Section */}
      <section className="relative bg-[#1e293b] text-white py-16 px-6 text-center shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">About Our Vendor Management System</h1>
          <p className="text-lg text-gray-300">
            We simplify the process of applying for government documents by making it fast, reliable, and hassle-free.
          </p>
        </div>
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg
"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#1e293b]">Why Choose Us?</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <FeatureCard icon={<FaUsers />} title="Trusted by Many" description="Thousands of users trust us for their document needs." />
          <FeatureCard icon={<FaShieldAlt />} title="Secure & Reliable" description="Your data is encrypted and handled with the highest security standards." />
          <FeatureCard icon={<FaClock />} title="Fast Processing" description="Quick application processing with real-time updates." />
          <FeatureCard icon={<FaCheckCircle />} title="Verified Services" description="All applications go through a strict verification process." />
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="bg-gray-200 py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#1e293b]">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <TeamMember
            name="Amit Kumar"
            role="Founder & CEO"
            image="https://randomuser.me/api/portraits/men/45.jpg"
          />
          <TeamMember
            name="Sneha Mehta"
            role="Operations Head"
            image="https://randomuser.me/api/portraits/women/50.jpg"
          />
          <TeamMember
            name="Ravi Sharma"
            role="Tech Lead"
            image="https://randomuser.me/api/portraits/men/55.jpg"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#00234E] text-white text-center py-6 shadow-md">
        <p>© 2025 Vendor Management System | All Rights Reserved</p>
      </footer>
    </div>
  );
};

/* Feature Card Component */
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300 hover:shadow-xl transition transform hover:scale-105 duration-300">
    <div className="text-[#1e293b] text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-[#1e293b]">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

/* Team Member Component */
const TeamMember = ({ name, role, image }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition transform hover:scale-105 duration-300">
    <img src={image} alt={name} className="w-24 h-24 mx-auto rounded-full border-2 border-gray-300 mb-4" />
    <h3 className="text-xl font-semibold text-[#1e293b]">{name}</h3>
    <p className="text-gray-600">{role}</p>
  </div>
);

export default About;
