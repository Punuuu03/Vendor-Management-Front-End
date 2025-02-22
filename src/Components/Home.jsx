import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaUserShield, FaFileAlt } from "react-icons/fa";
import { FaCreditCard, FaArrowRight } from "react-icons/fa";

import Safety16 from '../assets/landing1.jpg';
import Safety12 from '../assets/landing1.jpg';
import Safety13 from '../assets/landing1.jpg';

const iconMapping = {
  Passport: <FaFileAlt />,
  "Driving License": <FaUserShield />,
};

const cardData = [
  {
    id: 1,
    title: "Choose Category",
    details: "Select the government document you need.",
    bgColor: "bg-blue-500",
  },
  {
    id: 2,
    title: "Fill Form",
    details: "Provide necessary details and upload documents.",
    bgColor: "bg-green-500",
  },
  {
    id: 3,
    title: "Submit & Get Updates",
    details: "Track your application and receive updates.",
    bgColor: "bg-yellow-500",
  },
];

const ProcessCards = () => {
  const [services, setServices] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderImages = [Safety16, Safety12, Safety13];
  const totalSlides = sliderImages.length;

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide < totalSlides - 1 ? prevSlide + 1 : 0));
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [totalSlides]);

  useEffect(() => {
    fetch("https://vm.q1prh3wrjc0aw.ap-south-1.cs.amazonlightsail.com/document-types")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="bg-gray-100 text-[#1e293b] min-h-screen animate-fadeIn">
      <div className="hero-section flex flex-col md:flex-row justify-between items-center text-white bg-[#00234E] p-6 lg:h-full sm:h-70vh overflow-hidden">
        <div className="content lg:ml-20 md:ml-20 max-w-md mb-10 md:mb-0">
          <h1 className="text-7xl md:text-5xl font-bold mb-4 animate-fadeInUp">
            Vendor Management System
          </h1>
          <p className="text-lg text-gray-300">
            Apply for government documents easily with our seamless process.
          </p>
          <Link to="/apply">
            <button className="mt-6 bg-white text-[#1e293b] px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300 hover:scale-105">
              Apply Now
            </button>
          </Link>
        </div>

        <div className="slider relative w-full md:mr-20 max-w-2xl h-64 md:h-96 overflow-hidden rounded-lg">
          <div className="slider-images relative w-full h-full">
            {sliderImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Safety Product ${index + 1}`}
                className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                  currentSlide === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <section className="py-12 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#1e293b]">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.length > 0 ? (
            services.map((service) => (
              <ServiceCard
                key={service.doc_type_id}
                icon={iconMapping[service.doc_type_name] || <FaCheckCircle />}
                title={service.doc_type_name}
                description={`Apply for a ${service.doc_type_name} easily.`}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">Loading services...</p>
          )}
        </div>
      </section>

      <section className="bg-[#00234E] py-12 px-6">
        <h2 className="text-3xl font-bold text-center text-white mb-8">How It Works</h2>
        <div className="flex flex-wrap justify-center mt-12">
          {cardData.map((card) => (
            <div key={card.id} className="w-full md:w-1/3 px-6 mb-8">
              <div className="relative rounded-md bg-white shadow-md p-8 cursor-pointer">
                <div className="text-4xl font-bold text-blue-900 mb-4">0{card.id}</div>
                <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                <p className="text-gray-600 mb-4">{card.details}</p>
                <div
                  className={`absolute top-[-25px] left-1/2 transform -translate-x-1/2 ${card.bgColor} text-white rounded-full p-4`}
                >
                  <FaCreditCard className="text-4xl" />
                </div>
                <div className="absolute bottom-4 right-4 text-blue-900">
                  <FaArrowRight className="text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gray-100 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1e293b]">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Rahul Sharma",
              feedback: "The process was smooth and easy. Got my PAN card in just 5 days!",
              image: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
              name: "Priya Verma",
              feedback: "Amazing service! Applied for an Aadhar card update and received it quickly.",
              image: "https://randomuser.me/api/portraits/women/44.jpg",
            },
          ].map((user, index) => (
            <div
              key={index}
              className="flex items-center bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500 transition duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 mr-4"
              />
              <div>
                <div className="text-xl font-semibold text-gray-800">{user.name}</div>
                <p className="text-gray-600 mt-2 italic">"{user.feedback}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#00234E] text-white text-center py-6 shadow-md">
        <p>© 2025 Vendor Management System | All Rights Reserved</p>
      </footer>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const ServiceCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300 hover:shadow-xl transition transform hover:scale-105 duration-300">
    <div className="text-[#1e293b] text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-[#1e293b]">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default ProcessCards;
