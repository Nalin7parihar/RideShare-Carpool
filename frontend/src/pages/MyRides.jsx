import React, { useState, useEffect } from "react";

const MyRides = () => {
  const rides = [
    {
      id: 1,
      pickup: "Delhi",
      destination: "Mumbai",
      date: "2025-03-20", // Upcoming ride
      time: "10:00 AM",
      status: "Active",
    },
    {
      id: 2,
      pickup: "Bangalore",
      destination: "Pune",
      date: "2025-03-10", // Past ride
      time: "2:30 PM",
      status: "Completed",
    },
    {
      id: 3,
      pickup: "Hyderabad",
      destination: "Chennai",
      date: "2025-03-08", // Past ride
      time: "6:45 AM",
      status: "Cancelled",
    },
    {
      id: 4,
      pickup: "Kolkata",
      destination: "Delhi",
      date: "2025-03-25", // Upcoming ride
      time: "1:00 PM",
      status: "Active",
    },
  ];

  const [upcomingRides, setUpcomingRides] = useState([]);
  const [pastRides, setPastRides] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const today = new Date();
    const upcoming = rides.filter(
      (ride) => new Date(ride.date) >= today && ride.status === "Active"
    );
    const past = rides.filter(
      (ride) =>
        new Date(ride.date) < today &&
        ["Completed", "Cancelled"].includes(ride.status)
    );
    setUpcomingRides(upcoming);
    setPastRides(past);
  }, [rides]);

  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Rides</h2>

      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "upcoming"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
          {upcomingRides.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {upcomingRides.length}
            </span>
          )}
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "past"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past
          {pastRides.length > 0 && (
            <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              {pastRides.length}
            </span>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === "upcoming" ? (
          upcomingRides.length > 0 ? (
            upcomingRides.map((ride) => (
              <div
                key={ride.id}
                className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-lg font-medium text-gray-800">
                        {ride.pickup} → {ride.destination}
                      </span>
                      <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                        {ride.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {formatDate(ride.date)} • {ride.time}
                    </p>
                  </div>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                    Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No upcoming rides scheduled
            </div>
          )
        ) : pastRides.length > 0 ? (
          pastRides.map((ride) => (
            <div
              key={ride.id}
              className="bg-white border border-gray-200 p-4 rounded-lg opacity-80"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-medium text-gray-700">
                      {ride.pickup} → {ride.destination}
                    </span>
                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                      {ride.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {formatDate(ride.date)} • {ride.time}
                  </p>
                </div>
                <button className="text-gray-600 text-sm font-medium hover:text-gray-800">
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No past rides</div>
        )}
      </div>
    </div>
  );
};

export default MyRides;
