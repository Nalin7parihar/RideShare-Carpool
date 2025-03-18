import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { offerRide } from "../Store/rideSlice";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const driver = useSelector((state) => state.user.user); // Assuming user slice stores driver data
  const rides = useSelector((state) => state.rides.rides); // Fetching available rides

  const handleOfferRide = () => {
    const newRide = {
      id: rides.length + 1,
      driver: driver?.displayName || "Anonymous",
      from: "New Location",
      to: "Destination",
      time: "5:00 PM",
      seatsAvailable: 4,
      price: 200,
    };
    dispatch(offerRide(newRide));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Welcome, {driver?.displayName || "Driver"}!
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium">Your Rides:</h3>
        {rides.length > 0 ? (
          <ul className="mt-2">
            {rides.map((ride) => (
              <li key={ride.id} className="border p-2 my-2 rounded">
                <strong>{ride.from} → {ride.to}</strong> at {ride.time} | Seats: {ride.seatsAvailable}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No rides available.</p>
        )}
      </div>

      <button
        onClick={handleOfferRide}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Offer a Ride
      </button>
    </div>
  );
};

export default DriverDashboard;
