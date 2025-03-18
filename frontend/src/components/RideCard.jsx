import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchRides } from "../Store/rideSlice";
import { useNavigate } from "react-router-dom";
const RideCard = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const today = new Date().toLocaleDateString(); // Format today's date
  const [passengers, setPassengers] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = {from: pickup, to: destination, passengers: passengers};
    
    dispatch(fetchRides(searchParams))
      .unwrap()
      .then(() => {
        // Create URL with search parameters
        navigate(`/bookRide?from=${encodeURIComponent(pickup)}&to=${encodeURIComponent(destination)}&passengers=${passengers}`);
      })
      .catch((error) => {
        console.error('Failed to fetch rides:', error);
      });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pickup Location */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Pickup Location
          </label>
          <input
            type="text"
            placeholder="Enter pickup location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Destination
          </label>
          <input
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Date Label (Non-Editable) */}
        <div className="mt-6">
          <label className="text-lg font-semibold text-gray-700 block mb-2">
            Date of Travel:
          </label>
          <input  type = 'date' className="border border-gray-300 p-3 rounded-md shadow-sm w-full bg-gray-50 text-gray-800 font-medium"/>
        </div>

        {/* Number of Passengers */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Number of Passengers
          </label>
          <select
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">1 Passenger</option>
            <option value="2">2 Passengers</option>
            <option value="3">3 Passengers</option>
            <option value="4">4 Passengers</option>
            <option value="5">5+ Passengers</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
        >
          Search Ride
        </button>
      </form>
    </div>
  );
};

export default RideCard;
