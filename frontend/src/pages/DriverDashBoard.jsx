import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  offerRides,
  updateRide,
  completeRide,
  deleteRide,
} from "../Store/rideSlice";
import { toast } from "react-toastify";
import ActiveRideCard from "../components/ActiveRide";
import NoRideCard from "../components/NoRideCard";
import RideModal from "../components/RideModal";
import AuthService from "../services/authService";

const initialRideState = {
  from: "",
  to: "",
  time: "",
  date: "",
  seatsAvailable: "",
  price: "",
  fromCoordinates: null,
  toCoordinates: null,
};

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const driver = useSelector((state) => state.driver.driver);
  // Force re-render on rides state changes
  const rides = useSelector((state) => state.rides.rides);
  
  // Update filtering logic to properly get active rides from both sources
  const [updateKey, setUpdateKey] = useState(0);
  // State for driver's ride history
  const [driverRides, setDriverRides] = useState([]);
  
  // Improved active ride detection - check both Redux store and local driverRides
  const activeRidesFromStore = rides.filter(ride => ride?.ride?.status === "active");
  const activeRidesFromHistory = driverRides.filter(ride => ride.status === "active");
  
  // Combine active rides from both sources, prioritizing store data
  const activeRides = activeRidesFromStore.length > 0 
    ? activeRidesFromStore 
    : activeRidesFromHistory.map(ride => ({ ride }));
  
  // Get the most recent active ride
  const currentRide = activeRides.length > 0 ? activeRides[0] : null;
  const hasActiveRide = !!currentRide;

  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rideDetails, setRideDetails] = useState(initialRideState);

  // Fetch driver rides on component mount and when rides change
  useEffect(() => {
    const fetchDriverRides = async () => {
      if (driver?.driver?._id) {
        try {
          const rides = await AuthService.getDriverRides(driver.driver._id);
          setDriverRides(rides);
          
          // Store in localStorage
          localStorage.setItem('rides', JSON.stringify(rides));
          
          // Force UI update when rides are fetched
          setUpdateKey(prev => prev + 1);
        } catch (error) {
          console.error("Failed to fetch driver rides:", error);
        }
      }
    };

    // Check if user is a driver before fetching
    if (driver) {
      fetchDriverRides();
    }
  }, [driver, rides]);

  // Load driver rides from localStorage on initial load
  useEffect(() => {
    if (driver) {
      const storedRides = localStorage.getItem('rides');
      if (storedRides) {
        setDriverRides(JSON.parse(storedRides));
      }
    }
  }, [driver]);

  // Force refresh active rides when component mounts or driver changes
  useEffect(() => {
    if (driver?.driver?._id) {
      // Dispatch an action to refresh rides from the server
      dispatch({ type: 'driver/fetchDriverRides' });
      
      // Increment key to force component re-render
      setUpdateKey(prev => prev + 1);
    }
  }, [driver, dispatch]);

  // Modified handleInputChange to not reset coordinates (will be handled by RideCard)
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setRideDetails((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setShowModal(false);
    setIsUpdating(false);
    setRideDetails(initialRideState);
  }, []);

  // Modified handleUpdateRide to include coordinates if available
  const handleUpdateRide = useCallback(() => {
    if (currentRide?.ride?._id) {
      // Pre-fill form with current ride details
      setRideDetails({
        from: currentRide.ride.from || "",
        to: currentRide.ride.to || "",
        time: currentRide.ride.time || "",
        date: currentRide.ride.date || "",
        seatsAvailable: currentRide.ride.seatsAvailable || "",
        price: currentRide.ride.price || "",
        fromCoordinates: currentRide.ride.fromCoordinates || null,
        toCoordinates: currentRide.ride.toCoordinates || null,
      });
      setIsUpdating(true);
      setShowModal(true);
    }
  }, [currentRide]);

  // Modified validateRideDetails to not include geocoding
  const validateRideDetails = useCallback(() => {
    const { from, to, time, date, seatsAvailable, price } = rideDetails;

    if (!from.trim() || !to.trim() || !time.trim() || !date.trim()) {
      toast.error("Please fill in the location and time details.");
      return false;
    }

    const seats = parseInt(seatsAvailable);
    const ridePrice = parseFloat(price);

    if (isNaN(seats) || seats <= 0) {
      toast.error("Please enter a valid number of seats.");
      return false;
    }

    if (isNaN(ridePrice) || ridePrice <= 0) {
      toast.error("Please enter a valid price.");
      return false;
    }

    return true;
  }, [rideDetails]);

  // Modified handleOfferRide to not handle geocoding
  const handleOfferRide = useCallback(() => {
    // Check if user already has an active ride when offering a new one
    if (!isUpdating && hasActiveRide) {
      toast.error("You already have an active ride.");
      return;
    }
    
    try {
      const isValid = validateRideDetails();
      if (!isValid) return;

      const { from, to, time, date, seatsAvailable, price } = rideDetails;

      const newRide = {
        id: isUpdating ? currentRide?.ride?._id : driver?.driver?._id,
        from: from.trim(),
        to: to.trim(),
        time: time.trim(),
        date: date.trim(),
        seatsAvailable: parseInt(seatsAvailable),
        price: parseFloat(price)
        // Coordinates will be added by RideCard component
      };

      if (isUpdating) {
        dispatch(updateRide(newRide));
        setUpdateKey((prev) => prev + 1);
        toast.success("Ride updated successfully!");
        resetForm();
      } else {
        dispatch(offerRides(newRide));
        toast.success("Ride offered successfully!");
        resetForm();
      }
    } catch (error) {
      console.error("Error handling ride:", error);
      toast.error(
        `Failed to ${isUpdating ? "update" : "offer"} ride. Please try again.`
      );
    }
  }, [
    isUpdating,
    hasActiveRide,
    validateRideDetails,
    rideDetails,
    currentRide,
    driver,
    dispatch,
    resetForm,
  ]);

  const handleCompleteRide = useCallback(() => {
    if (currentRide?.ride?._id) {
      dispatch(completeRide(currentRide.ride._id)).then(() => {
        toast.success("Ride completed successfully!");
        // Force UI update
        setUpdateKey((prev) => prev + 1);
      });
    }
  }, [currentRide, dispatch]);

  const handleDeleteRide = useCallback(() => {
    if (currentRide?.ride?._id) {
      dispatch(deleteRide(currentRide.ride._id)).then(() => {
        toast.success("Ride deleted successfully!");
        // Force UI update
        setUpdateKey((prev) => prev + 1);
      });
    }
  }, [currentRide, dispatch]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Welcome, {driver?.driver?.name || "Driver"}!
      </h2>

      {/* Add key prop to force re-render when updateKey changes */}
      <div key={updateKey}>
        {/* Active Ride Section */}
        {currentRide ? (
          <ActiveRideCard
            currentRide={currentRide}
            onUpdate={handleUpdateRide}
            onComplete={handleCompleteRide}
            onDelete={handleDeleteRide}
          />
        ) : (
          <NoRideCard />
        )}
      </div>

      {/* Driver Ride History Section */}
      {driverRides.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Ride History</h3>
          <div className="space-y-4">
            {driverRides.map((ride) => (
              <div key={ride._id} className="p-4 border rounded-lg shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{ride.from} → {ride.to}</p>
                    <p className="text-sm text-gray-600">Date: {ride.date} at {ride.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">₹{ride.price}</p>
                    <p className="text-sm text-gray-600">Status: <span className={`font-medium ${
                      ride.status === 'completed' ? 'text-green-600' : 
                      ride.status === 'active' ? 'text-blue-600' : 'text-gray-600'
                    }`}>{ride.status}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offer Ride Button */}
      <button
        onClick={() => {
          setIsUpdating(false);
          setShowModal(true);
        }}
        className={`w-full text-white px-4 py-2 rounded-lg shadow transition mt-6 ${
          hasActiveRide
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={hasActiveRide}
      >
        + Offer a New Ride
      </button>

      {/* Ride Modal without geocoding status */}
      <RideModal
        showModal={showModal}
        isUpdating={isUpdating}
        rideDetails={rideDetails}
        handleInputChange={handleInputChange}
        handleSubmit={handleOfferRide}
        handleCancel={resetForm}
      />
    </div>
  );
};

export default DriverDashboard;
