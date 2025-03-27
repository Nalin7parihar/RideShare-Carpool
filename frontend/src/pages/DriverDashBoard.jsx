import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { offerRides } from "../Store/rideSlice";
import { toast } from "react-toastify";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const driver = useSelector((state) => state.driver.driver);
  const activeRide = useSelector((state) => state.rides.rides);


  const [showModal, setShowModal] = useState(false);
  const [rideDetails, setRideDetails] = useState({
    from: "",
    to: "",
    time: "",
    date : "",
    seatsAvailable: "",
    price: "",
  });

  useEffect(() => {
    // Load rides from local storage when component mounts
    const storedRides = localStorage.getItem("rides");
    if (storedRides) {
      dispatch({ type: "rides/setRides", payload: JSON.parse(storedRides) });
    }
  }, [dispatch]);

  useEffect(() => {
    // Save rides to local storage whenever rides change
    localStorage.setItem("rides", JSON.stringify(activeRide));
  }, [activeRide]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setRideDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleOfferRide = () => {
    if (activeRide) {
      toast.error("You already have an active ride.");
      return;
    }

    const { from, to, time,date, seatsAvailable, price } = rideDetails;
    if (!from.trim() || !to.trim() || !time.trim() || !date.trim()) {
      toast.error("Please fill in the location and time details.");
      return;
    }

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
      date : date.trim(),
      seatsAvailable: seats,
      price: ridePrice,
      status: "active",
    };

    try {
      dispatch(offerRides(newRide));
      toast.success("Ride offered successfully!");
      setShowModal(false);
      setRideDetails({ from: "", to: "", time: "",date : "", seatsAvailable: "", price: "" });
    } catch (error) {
      toast.error("Failed to offer ride. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Welcome, {driver?.driver?.name || "Driver"}!
      </h2>

      {/* Active Ride Section */}
      {activeRide ? (
        <div className="border p-4 rounded-lg bg-yellow-100 shadow-md mb-6">
          <h3 className="text-lg font-medium text-yellow-800">Active Ride</h3>
          <p className="text-blue-600 font-bold">{activeRide.from} → {activeRide.to}</p>
          <p className="text-gray-700">Time: {activeRide.time}</p>
          <p className="text-amber-900">Date: {activeRide.date}</p>
          <p className="text-green-600 font-semibold">₹{activeRide.price}</p>
          <div className="flex gap-3 mt-3">
            <button onClick={() => dispatch(completeRide(activeRide.id))} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Complete Ride
            </button>
            <button onClick={() => dispatch(deleteRide(activeRide.id))} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Delete Ride
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center py-4">No active rides.</p>
      )}

      {/* Previous Rides Section */}
      {/* <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Previous Rides</h3>
        {previousRides.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {previousRides.map((ride) => (
              <div key={ride.id} className="border p-4 rounded-lg bg-gray-100 shadow-md">
                <p className="font-bold text-blue-600">{activeride.from} → {ride.to}</p>
                <p className="text-sm text-gray-600">Time: {ride.time}</p>
                <p className="text-green-600 font-semibold">₹{ride.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No previous rides.</p>
        )}
      </div> */}

      {/* Offer Ride Button */}
      <button
        onClick={() => setShowModal(true)}
        className={`w-full text-white px-4 py-2 rounded-lg shadow transition ${activeRide ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        disabled={activeRide}
      >
        + Offer a New Ride
      </button>

      {/* Offer Ride Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Offer a Ride</h3>
            <div className="space-y-4">
              <input type="text" name="from" placeholder="From" value={rideDetails.from} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} />
              <input type="text" name="to" placeholder="To" value={rideDetails.to} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} />
              <input type="time" name="time" value={rideDetails.time} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} />
              <input type="date" name="date" value={rideDetails.date} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} />
              <input type="number" name="seatsAvailable" placeholder="Seats Available" value={rideDetails.seatsAvailable} min="1" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} />
              <input type="number" name="price" placeholder="Price (₹)" value={rideDetails.price} min="0" step="0.01" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
                <button onClick={handleOfferRide} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Submit Ride</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
