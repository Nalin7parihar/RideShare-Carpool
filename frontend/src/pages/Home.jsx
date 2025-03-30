import { useState } from "react";
import React from "react";
import RideCard from "../components/RideCard";
import { motion } from "framer-motion";
import AboutUsPopup from "../components/AboutUs";
import { useNavigate } from "react-router-dom";

const Home = ({ formRef, scrollToForm }) => {
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Animation variants for consistent effects
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://cdn.blablacar.com/k/a/images/carpool_only_large-138d9f97c3f7113d.svg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-black/50"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Travel Together,{" "}
            <span className="text-blue-300">Save Together</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-100 mb-8"
          >
            Find affordable rides or offer seats in your car. Connect with
            verified members and make travel more sustainable, affordable, and
            social.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition font-semibold text-lg"
              onClick={scrollToForm}
            >
              Find a Ride
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition font-semibold text-lg"
              onClick={() => navigate("/driver-dashboard")}
            >
              Offer a Ride
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-4 md:px-6 py-16 w-full">
        {/* Booking Form with Travel Date */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-xl shadow-xl mb-16 border border-gray-100"
          ref={formRef}
        >
          <h3 className="text-2xl font-bold text-blue-600 mb-6">
            Book Your Next Trip
          </h3>
          <RideCard />
        </motion.div>

        {/* How It Works */}
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full max-w-5xl mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: 1,
                title: "Search a Ride",
                text: "Enter your start and end locations, preferred date, and find available rides that match your route.",
              },
              {
                step: 2,
                title: "Book & Pay",
                text: "Select the ride that suits you best, book your seat securely, and pay through our secure payment system.",
              },
              {
                step: 3,
                title: "Enjoy the Ride",
                text: "Meet at the agreed location, travel together, and leave a review after your journey is complete.",
              },
            ].map(({ step, title, text }) => (
              <div
                key={step}
                className="relative z-10 flex flex-col items-center text-center px-4"
              >
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6">
                  {step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {title}
                </h3>
                <p className="text-gray-600">{text}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <div>
              {/* About Us Button */}
              <button
                onClick={() => {
                  setIsOpen(true);
                  setIsAboutUsOpen(true);
                }}
                className="text-blue-600 font-semibold hover:text-blue-800 transition flex items-center mx-auto"
              >
                Learn more about the process
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 010-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Render AboutUsModal when state is true */}
              {isAboutUsOpen && (
                <AboutUsPopup
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                />
              )}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Home;
