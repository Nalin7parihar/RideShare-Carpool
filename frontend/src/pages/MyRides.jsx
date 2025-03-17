import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MyRides = () => {
  // Dummy rides data
  const [rides, setRides] = useState([
    { id: 1, pickup: "Delhi", destination: "Mumbai", date: "2025-03-15", time: "10:00 AM" },
    { id: 2, pickup: "Bangalore", destination: "Pune", date: "2025-03-20", time: "2:30 PM" },
    { id: 3, pickup: "Hyderabad", destination: "Chennai", date: "2025-03-05", time: "6:45 AM" },
  ]);

  const [upcomingRides, setUpcomingRides] = useState([]);
  const [pastRides, setPastRides] = useState([]);

  useEffect(() => {
    const today = new Date();
    const upcoming = rides.filter((ride) => new Date(ride.date) >= today);
    const past = rides.filter((ride) => new Date(ride.date) < today);
    setUpcomingRides(upcoming);
    setPastRides(past);
  }, [rides]);

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">My Rides</h2>

      {/* Upcoming Rides Section */}
      <section>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">🚀 Upcoming Rides</h3>
        {upcomingRides.length > 0 ? (
          upcomingRides.map((ride) => (
            <motion.div
              key={ride.id}
              className="bg-blue-50 p-4 rounded-lg mb-4 shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-lg font-semibold text-gray-800">
                {ride.pickup} ➝ {ride.destination}
              </p>
              <p className="text-gray-600">📅  at {ride.time}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No upcoming rides.</p>
        )}
      </section>

      {/* Past Rides Section */}
      <section className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">⏳ Past Rides</h3>
        {pastRides.length > 0 ? (
          pastRides.map((ride) => (
            <motion.div
              key={ride.id}
              className="bg-gray-100 p-4 rounded-lg mb-4 shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-lg font-semibold text-gray-800">
                {ride.pickup} ➝ {ride.destination}
              </p>
              <p className="text-gray-600">📅 at {ride.time}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No past rides.</p>
        )}
      </section>
    </div>
  );
};

export default MyRides;
