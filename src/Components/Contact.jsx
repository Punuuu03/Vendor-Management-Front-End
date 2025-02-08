import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="bg-gray-100 text-[#1e293b] min-h-screen animate-fadeIn">
      {/* Hero Section */}
      <section className="relative bg-[#1e293b] text-white py-16 px-6 text-center shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-300">
            Have any questions or need assistance? Reach out to us anytime.
          </p>
        </div>
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1562564055-71e051d33c19"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Contact Form & Details Section */}
      <section className="py-12 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-2xl font-bold mb-4 text-[#1e293b]">Send Us a Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e293b] outline-none transition"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e293b] outline-none transition"
            />
            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e293b] outline-none transition"
            ></textarea>
            <button className="w-full bg-[#1e293b] text-white py-3 rounded-md font-semibold hover:bg-[#324158] transition duration-300">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-2xl font-bold mb-4 text-[#1e293b]">Contact Details</h2>
          <ContactInfo icon={<FaPhoneAlt />} label="Phone" value="+91 98765 43210" />
          <ContactInfo icon={<FaEnvelope />} label="Email" value="support@vendorportal.com" />
          <ContactInfo icon={<FaMapMarkerAlt />} label="Address" value="123 Business Street, Mumbai, India" />
        </div>
      </section>

      {/* Google Map Section */}
      {/* <section className="py-12 px-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#1e293b]">Our Location</h2>
        <div className="max-w-6xl mx-auto">
          <iframe
            title="Company Location"
            className="w-full h-64 rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1281496067193!2d144.96305831558605!3d-37.81410797975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e33!2sMelbourne%2C+Victoria%2C+Australia!5e0!3m2!1sen!2sin!4v1633022207191!5m2!1sen!2sin"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-[#1e293b] text-white text-center py-6 shadow-md">
        <p>© 2025 Vendor Management System | All Rights Reserved</p>
      </footer>
    </div>
  );
};

/* Contact Info Component */
const ContactInfo = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4 p-4 border-b border-gray-200 hover:bg-gray-100 transition duration-300 rounded-md">
    <div className="text-[#1e293b] text-2xl">{icon}</div>
    <div>
      <p className="text-lg font-semibold">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);

export default Contact;
