import React, { useState, useEffect } from "react";

const MyRides = () => {
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [pastRides, setPastRides] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedRide, setSelectedRide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get rides from local storage
    const storedRides = JSON.parse(localStorage.getItem("rides")) || [];
    const ridesData = storedRides.map((item) => item.ride || item);

    // For testing, use a fixed date or the current date
    const today = new Date("2024-01-23"); // Using current date

    console.log("Today's date for comparison:", today);
    console.log("Rides from local storage:", ridesData);

    const upcoming = ridesData.filter((ride) => {
      const rideDate = new Date(ride.date);
      const isUpcoming = rideDate >= today && ride.status === "active";
      console.log(
        `Ride ${ride._id} date: ${rideDate}, Is upcoming: ${isUpcoming}`
      );
      return isUpcoming;
    });

    const past = ridesData.filter((ride) => {
      const rideDate = new Date(ride.date);
      return (
        (rideDate < today || ride.status !== "active") &&
        ["completed", "cancelled"].includes(ride.status)
      );
    });

    console.log("Upcoming rides:", upcoming);
    console.log("Past rides:", past);

    setUpcomingRides(upcoming);
    setPastRides(past);
    setIsLoading(false);
  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleViewDetails = (rideId) => {
    // Find the ride in either upcoming or past rides
    const ride = [...upcomingRides, ...pastRides].find((r) => r._id === rideId);
    setSelectedRide(ride);
    console.log("Viewing details for ride:", ride);
  };

  const closeDetails = () => {
    setSelectedRide(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center py-8 text-gray-500">Loading rides...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Rides</h2>

      {selectedRide ? (
        <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Ride Details
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={closeDetails}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-lg font-medium text-gray-800">
                {selectedRide.from} → {selectedRide.to}
              </span>
              <span
                className={`ml-2 text-xs px-2 py-1 rounded-full ${
                  selectedRide.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : selectedRide.status === "Completed"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedRide.status}
              </span>
            </div>

            <p className="text-gray-600">
              <strong>Date & Time:</strong> {formatDate(selectedRide.date)} at{" "}
              {selectedRide.time}
            </p>

            {selectedRide.details && (
              <p className="text-gray-600">
                <strong>Vehicle:</strong> {selectedRide.details}
              </p>
            )}

            <div className="pt-4 border-t border-gray-200">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={closeDetails}
              >
                Back to Rides
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
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
                    key={ride._id}
                    className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-lg font-medium text-gray-800">
                            {ride.from} → {ride.to}
                          </span>
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            {ride.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {formatDate(ride.date)} • {ride.time}
                        </p>
                      </div>
                      <button
                        className="text-blue-600 text-sm font-medium hover:text-blue-800"
                        onClick={() => handleViewDetails(ride._id)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No upcoming rides scheduled. Book a ride to get started!
                </div>
              )
            ) : pastRides.length > 0 ? (
              pastRides.map((ride) => (
                <div
                  key={ride._id}
                  className="bg-white border border-gray-200 p-4 rounded-lg opacity-80"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-lg font-medium text-gray-700">
                          {ride.from} → {ride.to}
                        </span>
                        <span
                          className={`ml-2 text-xs px-2 py-1 rounded-full ${
                            ride.status === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {ride.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {formatDate(ride.date)} • {ride.time}
                      </p>
                    </div>
                    <button
                      className="text-gray-600 text-sm font-medium hover:text-gray-800"
                      onClick={() => handleViewDetails(ride._id)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No past rides found. Once you complete rides, they will appear
                here.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyRides;
