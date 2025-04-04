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
import { useRideSocket } from "../hooks/useRideSocket";
import { clearBookingRequests } from "../Store/socketSlice";

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
  const rides = useSelector((state) => state.rides.rides);
  const {
    connected,
    reachedPickup,
    startRide,
    endRide,
    rideStatuses,
    pendingBookings,
    respondToBooking,
  } = useRideSocket("driver");

  const [driverRides, setDriverRides] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rideDetails, setRideDetails] = useState(initialRideState);

  // Improved active ride detection - check both Redux store and local driverRides
  const activeRidesFromStore = rides.filter(
    (ride) => ride?.ride?.status === "active"
  );
  const activeRidesFromHistory = driverRides.filter(
    (ride) => ride.status !== "completed"
  );

  // Combine active rides from both sources, prioritizing store data
  const activeRides =
    activeRidesFromStore.length > 0
      ? activeRidesFromStore
      : activeRidesFromHistory.map((ride) => ({ ride }));

  // Get the most recent active ride
  const currentRide = activeRides.length > 0 ? activeRides[0] : null;
  const hasActiveRide = !!currentRide;

  // Main fetch function that gets driver rides and updates state
  const refreshRides = useCallback(async () => {
    if (driver?.driver?._id) {
      try {
        // Dispatch an action to refresh rides from the server (using action type from original code)
        dispatch({ type: "driver/fetchDriverRides" });

        // Also fetch directly to update local component state
        const rides = await AuthService.getDriverRides(driver.driver._id);
        setDriverRides(rides);

        // Store in localStorage as backup
        localStorage.setItem("rides", JSON.stringify(rides));
      } catch (error) {
        console.error("Failed to fetch driver rides:", error);
        toast.error("Failed to fetch your ride history");

        // Try to load from localStorage as fallback
        const storedRides = localStorage.getItem("rides");
        if (storedRides) {
          setDriverRides(JSON.parse(storedRides));
        }
      }
    }
  }, [driver, dispatch]);

  // Load initial data on component mount
  useEffect(() => {
    if (driver?.driver?._id) {
      refreshRides();
    }
  }, [driver, refreshRides]);

  // Handle socket events by refreshing rides
  useEffect(() => {
    // This effect will run whenever socket events change ride statuses
    if (connected && driver?.driver?._id) {
      refreshRides();
    }
  }, [connected, rideStatuses, refreshRides, driver]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setRideDetails((prev) => ({ ...prev, [name]: value }));
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
        fromCoordinates: currentRide.ride.fromCoordinates || null,
        toCoordinates: currentRide.ride.toCoordinates || null,
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

  const handleOfferRide = useCallback(async () => {
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
        price: parseFloat(price),
      };

      if (isUpdating) {
        await dispatch(updateRide(newRide));
        toast.success("Ride updated successfully!");
      } else {
        await dispatch(offerRides(newRide));
        toast.success("Ride offered successfully!");
      }

      // Refresh rides after update
      await refreshRides();
      resetForm();
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
    refreshRides,
  ]);

  const handleCompleteRide = useCallback(async () => {
    if (currentRide?.ride?._id) {
      try {
        await dispatch(completeRide(currentRide.ride._id));
        toast.success("Ride completed successfully!");
        await refreshRides();
      } catch (error) {
        toast.error("Failed to complete ride. Please try again.");
      }
    }
  }, [currentRide, dispatch, refreshRides]);

  const handleDeleteRide = useCallback(async () => {
    if (currentRide?.ride?._id) {
      try {
        await dispatch(deleteRide(currentRide.ride._id));
        toast.success("Ride deleted successfully!");
        await refreshRides();
      } catch (error) {
        toast.error("Failed to delete ride. Please try again.");
      }
    }
  }, [currentRide, dispatch, refreshRides]);

  // Socket handling functions
  const handleAcceptBooking = useCallback(async () => {
    if (currentRide?.ride?._id && driver?.driver?._id) {
      // Find the latest pending booking for this ride
      const latestBooking = pendingBookings.find(
        (booking) => booking.rideId === currentRide.ride._id
      );

      if (latestBooking) {
        respondToBooking({
          driverId: driver.driver._id,
          rideId: currentRide.ride._id,
          accepted: true,
          sessionId: latestBooking.sessionId,
        });
        dispatch(clearBookingRequests());
        // Refresh rides after accepting booking
        await refreshRides();
      }
    }
  }, [
    currentRide,
    driver,
    respondToBooking,
    pendingBookings,
    dispatch,
    refreshRides,
  ]);

  const handleDeclineBooking = useCallback(async () => {
    if (currentRide?.ride?._id && driver?.driver?._id) {
      // Find the latest pending booking for this ride
      const latestBooking = pendingBookings.find(
        (booking) => booking.rideId === currentRide.ride._id
      );

      if (latestBooking) {
        respondToBooking({
          driverId: driver.driver._id,
          rideId: currentRide.ride._id,
          accepted: false,
          sessionId: latestBooking.sessionId,
        });
        dispatch(clearBookingRequests());
        // Refresh rides after declining booking
        await refreshRides();
      }
    }
  }, [
    currentRide,
    driver,
    respondToBooking,
    pendingBookings,
    dispatch,
    refreshRides,
  ]);

  const handleStartRide = useCallback(async () => {
    if (currentRide?.ride?._id && driver?.driver?._id) {
      startRide({
        driverId: driver.driver._id,
        rideId: currentRide.ride._id,
      });
      toast.success("Ride started successfully!");
      await refreshRides();
    }
  }, [currentRide, driver, startRide, refreshRides]);

  const handleEndRide = useCallback(async () => {
    if (currentRide?.ride?._id && driver?.driver?._id) {
      endRide({
        driverId: driver.driver._id,
        rideId: currentRide.ride._id,
      });
      toast.success("Ride completed successfully!");
      await refreshRides();
    }
  }, [currentRide, driver, endRide, refreshRides]);

  const handleReachedPickup = useCallback(async () => {
    if (currentRide?.ride?._id && driver?.driver?._id) {
      reachedPickup({
        driverId: driver.driver._id,
        rideId: currentRide.ride._id,
      });
      toast.success("Reached pickup location!");
      await refreshRides();
    }
  }, [currentRide, driver, reachedPickup, refreshRides]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Welcome, {driver?.driver?.name || "Driver"}!
      </h2>

      <div>
        {/* Active Ride Section */}
        {currentRide ? (
          <ActiveRideCard
            currentRide={currentRide}
            onUpdate={handleUpdateRide}
            onComplete={handleCompleteRide}
            onDelete={handleDeleteRide}
            onStartRide={handleStartRide}
            onEndRide={handleEndRide}
            onReachedPickup={handleReachedPickup}
            onAcceptBooking={handleAcceptBooking}
            onDeclineBooking={handleDeclineBooking}
            pendingBookings={pendingBookings}
            socketConnected={connected}
            rideStatuses={rideStatuses}
          />
        ) : (
          <NoRideCard />
        )}
      </div>

      {/* Driver Ride History Section */}
      {driverRides.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Your Ride History
          </h3>
          <div className="space-y-4">
            {driverRides.map((ride) => (
              <div key={ride._id} className="p-4 border rounded-lg shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {ride.from} → {ride.to}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {ride.date} at {ride.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">₹{ride.price}</p>
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          ride.status === "completed"
                            ? "text-green-600"
                            : ride.status === "active"
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {ride.status}
                      </span>
                    </p>
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
          setRideDetails(initialRideState);
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
