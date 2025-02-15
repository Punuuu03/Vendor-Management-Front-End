import React from "react";
import { FaCreditCard, FaArrowRight } from "react-icons/fa";

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

const Process = () => {
  return (
    <section className="bg-gray-300 py-12 px-6">
      <h2 className="text-3xl font-bold text-center text-black mb-8">How It Works</h2>
      <div className="flex flex-wrap justify-center mt-12">
        {cardData.map((card) => (
          <div key={card.id} className="w-full md:w-1/3 px-6 mb-8">
            <div className="relative rounded-md bg-white shadow-md p-8 cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-lg">
              <div className="text-4xl font-bold text-blue-900 mb-4">0{card.id}</div>
              <h3 className="text-2xl font-bold mb-4 text-[#1e293b]">{card.title}</h3>
              <p className="text-gray-600 mb-4">{card.details}</p>
              <div
                className={`absolute top-[-25px] left-1/2 transform -translate-x-1/2 ${card.bgColor} text-white rounded-full p-4 shadow-lg`}
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
  );
};

export default Process;
