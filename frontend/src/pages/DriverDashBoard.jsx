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

const initialRideState = {
  from: "",
  to: "",
  time: "",
  date: "",
  seatsAvailable: "",
  price: "",
};

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const driver = useSelector((state) => state.driver.driver);
  // Force re-render on rides state changes
  const rides = useSelector((state) => state.rides.rides);
  // Update filtering logic to get the most recent active ride
  const activeRides = rides.filter((ride) => ride?.ride?.status === "active");

  // Add key to force re-render
  const [updateKey, setUpdateKey] = useState(0);

  // Always get the most recent active ride
  const currentRide =
    activeRides.length > 0 ? activeRides[activeRides.length - 1] : null;

  const hasActiveRide = !!currentRide;

  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rideDetails, setRideDetails] = useState(initialRideState);

  // Listen for ride updates to force re-render
  useEffect(() => {
    // Increment key to force component re-render when rides change
    setUpdateKey((prev) => prev + 1);
  }, [rides]);

  useEffect(() => {
    const storedRides = localStorage.getItem("rides");
    if (storedRides) {
      dispatch({ type: "rides/setRides", payload: JSON.parse(storedRides) });
    }
  }, [dispatch]); // Only run on mount

  // Second useEffect to update localStorage when rides state changes
  useEffect(() => {
    // Save to localStorage whenever rides state updates
    if (rides.length > 0) {
      localStorage.setItem("rides", JSON.stringify(rides));
    }
  }, [rides]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setRideDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setShowModal(false);
    setIsUpdating(false);
    setRideDetails(initialRideState);
  }, []);

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
      });
      setIsUpdating(true);
      setShowModal(true);
    }
  }, [currentRide]);

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

  const handleOfferRide = useCallback(() => {
    // Check if user already has an active ride when offering a new one
    if (!isUpdating && hasActiveRide) {
      toast.error("You already have an active ride.");
      return;
    }

    if (!validateRideDetails()) {
      return;
    }

    const { from, to, time, date, seatsAvailable, price } = rideDetails;

    const newRide = {
      id: isUpdating ? currentRide?.ride?._id : driver?.driver?._id,
      from: from.trim(),
      to: to.trim(),
      time: time.trim(),
      date: date.trim(),
      seatsAvailable: parseInt(seatsAvailable),
      price: parseFloat(price),
    };

    try {
      if (isUpdating) {
        // Wait for the update to complete before resetting form
        dispatch(updateRide(newRide))
          .then(() => {
            // Force a re-render to show updated ride details
            setUpdateKey((prev) => prev + 1);
            toast.success("Ride updated successfully!");
            resetForm();
          })
          .catch((error) => {
            console.error("Error updating ride:", error);
            toast.error("Failed to update ride. Please try again.");
          });
      } else {
        dispatch(offerRides(newRide))
          .then(() => {
            toast.success("Ride offered successfully!");
            resetForm();
          })
          .catch((error) => {
            console.error("Error offering ride:", error);
            toast.error("Failed to offer ride. Please try again.");
          });
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

      {/* Offer Ride Button */}
      <button
        onClick={() => {
          setIsUpdating(false);
          setShowModal(true);
        }}
        className={`w-full text-white px-4 py-2 rounded-lg shadow transition ${
          hasActiveRide
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={hasActiveRide}
      >
        + Offer a New Ride
      </button>

      {/* Ride Modal */}
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
