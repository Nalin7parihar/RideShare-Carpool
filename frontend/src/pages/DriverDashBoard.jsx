import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { offerRides } from "../Store/rideSlice";
import { toast } from "react-toastify";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const driver = useSelector((state) => state.driver.driver);
  const rides = useSelector((state) => state.rides.rides);
  const [showModal, setShowModal] = useState(false);
  const [rideDetails, setRideDetails] = useState({
    from: "",
    to: "",
    time: "",
    seatsAvailable: "",
    price: "",
  });

  const resetRideDetails = () => ({
    from: "",
    to: "",
    time: "",
    seatsAvailable: "",
    price: "",
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setRideDetails(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleOfferRide = () => {
    // More comprehensive validation
    const { from, to, time, seatsAvailable, price } = rideDetails;
    console.log(driver);
    // Trim and check for empty strings
    if (!from.trim() || !to.trim() || !time.trim()) {
      toast.error("Please fill in the location and time details.");
      return;
    }

    // Validate seats and price are positive numbers
    const seats = parseInt(seatsAvailable);
    const ridePrice = parseFloat(price);

    if (isNaN(seats) || seats <= 0) {
      toast.error("Please enter a valid number of seats.");
      return;
    }

    if (isNaN(ridePrice) || ridePrice <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    const newRide = {
      id: driver?.driver?._id,
      from: from.trim(),
      to: to.trim(),
      time: time.trim(),
      seatsAvailable: seats,
      price: ridePrice,
    };

    console.log('New Ride :', newRide);
    try {
      dispatch(offerRides(newRide));
      toast.success("Ride offered successfully!");
      setShowModal(false);
      // Reset form after successful submission
      setRideDetails(resetRideDetails());
    } catch (error) {
      toast.error("Failed to offer ride. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Welcome, {driver?.driver?.name || "Driver"}!
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Your Rides:</h3>
        {
        rides?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {rides.map((ride) => 
            (
              <div 
                key={ride.ride.id} 
                className="border p-4 rounded-lg bg-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-blue-600">{ride.ride.from} → {ride.ride.to}</span>
                  <span className="text-sm text-gray-600">@{ride.ride.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Seats: {ride.ride.seatsAvailable}</span>
                  <span className="font-semibold text-green-600">₹{ride.ride.price}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No rides available. Start offering rides!</p>
        )}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        + Offer a New Ride
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Offer a Ride</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                name="from"
                placeholder="From" 
                value={rideDetails.from}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={handleInputChange} 
              />
              <input 
                type="text" 
                name="to"
                placeholder="To" 
                value={rideDetails.to}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={handleInputChange} 
              />
              <input 
                type="time" 
                name="time"
                placeholder="Time" 
                value={rideDetails.time}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={handleInputChange} 
              />
              <input 
                type="number" 
                name="seatsAvailable"
                placeholder="Seats Available" 
                value={rideDetails.seatsAvailable}
                min="1"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={handleInputChange} 
              />
              <input 
                type="number" 
                name="price"
                placeholder="Price (₹)" 
                value={rideDetails.price}
                min="0"
                step="0.01"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={handleInputChange} 
              />
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleOfferRide} 
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Submit Ride
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;