import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchRides } from "../Store/rideSlice";
import { useNavigate } from "react-router-dom";

const RideCard = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(""); // Format today's date
  const [passengers, setPassengers] = useState(1);
  
  // Add geocoding state
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState(null);
  const [fromCoordinates, setFromCoordinates] = useState(null);
  const [toCoordinates, setToCoordinates] = useState(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Add geocoding function
  const geocodeAddress = async (address, setCoordinates) => {
    if (!address.trim()) return;
    
    setIsGeocoding(true);
    setGeocodeError(null);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const data = await response.json();
      console.log(data);
      if (data.length === 0) {
        setGeocodeError(`Could not find coordinates for "${address}"`);
        return;
      }
      
      setCoordinates({
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      });
    } catch (error) {
      console.error("Geocoding error:", error);
      setGeocodeError("Failed to get location coordinates. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  };
  
  // Add useEffects for geocoding
  useEffect(() => {
    if (pickup) {
      geocodeAddress(pickup, setFromCoordinates);
    }
  }, [pickup]);
  
  useEffect(() => {
    if (destination) {
      geocodeAddress(destination, setToCoordinates);
    }
  }, [destination]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fromCoordinates || !toCoordinates) {
      setGeocodeError("Please wait for location coordinates to be determined");
      return;
    }
    
    const searchParams = {
      pickup: pickup,
      dropoff: destination,
      date: date,
      fromCoordinates: fromCoordinates,
      toCoordinates: toCoordinates
    };

    dispatch(fetchRides(searchParams))
      .unwrap()
      .then(() => {
        navigate(
          `/bookRide?from=${encodeURIComponent(pickup)}&to=${encodeURIComponent(
            destination
          )}&passengers=${passengers}&fromLat=${fromCoordinates.lat}&fromLon=${fromCoordinates.lon}&toLat=${toCoordinates.lat}&toLon=${toCoordinates.lon}`
        );
      })
      .catch((error) => {
        console.error("Failed to fetch rides:", error);
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
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 p-3 rounded-md shadow-sm w-full bg-gray-50 text-gray-800 font-medium"
          />
        </div>

        {isGeocoding && (
          <div className="text-center my-2">
            <p className="text-blue-600">Determining location coordinates...</p>
          </div>
        )}
        
        {geocodeError && (
          <div className="text-center my-2">
            <p className="text-red-600">{geocodeError}</p>
          </div>
        )}

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
          disabled={isGeocoding || !fromCoordinates || !toCoordinates}
        >
          Search Rides
        </button>
      </form>
    </div>
  );
};

export default RideCard;
