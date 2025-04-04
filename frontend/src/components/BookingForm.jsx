import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { bookRide } from "../Store/bookingSlice";
import { toast } from "react-toastify";
import { useRideSocket } from "../hooks/useRideSocket";

const BookingForm = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [isWaitingForDriver, setIsWaitingForDriver] = useState(false);
  const [bookingTimedOut, setBookingTimedOut] = useState(false);
  const timeoutIdRef = useRef(null);
  const [bookingSessionId, setBookingSessionId] = useState(null);

  // Get the specific ride from your rides state
  const ride = useSelector((state) =>
    state.rides.rides.find((r) => r._id === rideId)
  );

  // Get booking status and error
  const bookingStatus = useSelector((state) => state.booking.status);
  const bookingError = useSelector((state) => state.booking.error);
  const user = useSelector((state) => state.user.user);

  // Get socket-related functionality from the hook
  const { connected, rideStatuses, driverResponses, requestBooking } =
    useRideSocket("customer");

  // Get current ride status from socket if available
  const currentRideStatus =
    rideStatuses[rideId] || (ride ? ride.status : "Unknown");

  console.log("My booked Ride", ride);
  console.log("My User", user);
  console.log("Socket connected:", connected);
  console.log("Current ride status:", currentRideStatus);
  console.log("Current driverResponses:", driverResponses);
  console.log("Current bookingSessionId:", bookingSessionId);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!ride) {
      navigate("/bookRide");
    }
  }, [ride, navigate]);

  // Listen for driver responses
  useEffect(() => {
    if (!isWaitingForDriver || !bookingSessionId) {
      return; // Don't process responses if we're not waiting or don't have a session ID
    }

    // Check if there's a response for this ride AND this booking session
    const response = driverResponses.find(
      (resp) => resp.rideId === rideId // Exact match for current session
    );

    console.log("Driver response:", response);
    if (response) {
      // Clear the timeout since we got a response
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }

      setIsWaitingForDriver(false);

      if (response.status === "Accepted") {
        toast.success("Driver accepted your ride request!");

        // Now save the booking in the database
        dispatch(
          bookRide({
            rideId: ride._id,
            userId: user?.user?._id,
            seatsBooked: seatsToBook,
          })
        )
          .unwrap()
          .then(() => {
            toast.success("Booking confirmed and saved!");
            navigate("/user-rides");
          })
          .catch((error) => {
            toast.error(
              `Failed to save booking: ${error.message || "Unknown error"}`
            );
          });
      } else if (response.status === "Rejected") {
        toast.warning("Driver rejected your ride request.");
        setBookingTimedOut(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    }
  }, [
    driverResponses,
    rideId,
    bookingSessionId,
    isWaitingForDriver,
    dispatch,
    navigate,
    ride,
    seatsToBook,
    user,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!connected) {
      toast.error(
        "Cannot book without real-time connection. Please try again later."
      );
      return;
    }

    // Validate user
    if (!user?.user?._id) {
      toast.error("User information missing. Please log in again.");
      return;
    }

    // Validate ride
    if (!ride?._id) {
      toast.error("Ride information missing. Please select a ride again.");
      return;
    }

    try {
      // Reset states for new booking attempt
      setIsWaitingForDriver(true);
      setBookingTimedOut(false);
      setBookingSessionId(null); // Clear previous session ID

      toast.info("Sending request to available drivers...");

      // Request booking via socket and store the session ID
      const result = await requestBooking({
        customerId: user?.user?._id,
        rideId: ride._id,
      }).catch((error) => {
        setIsWaitingForDriver(false);
        console.log("Request error", error);
        toast.error(`Request failed: ${error.message || "Unknown error"}`);
      });

      if (result?.sessionId) {
        setBookingSessionId(result.sessionId);
        console.log("New booking session started:", result.sessionId);
      }

      // Set a timeout for driver response
      timeoutIdRef.current = setTimeout(() => {
        toast.error(
          "No driver responded to your request. Please try again later."
        );
        setIsWaitingForDriver(false);
        setBookingTimedOut(true);
        timeoutIdRef.current = null;

        // Redirect after timeout
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }, 30000); // 30 seconds timeout
    } catch (error) {
      setIsWaitingForDriver(false);
      toast.error(`Request failed: ${error.message || "Unknown error"}`);
    }
  };

  useEffect(() => {
    // Effect to handle successful booking status
    if (bookingStatus === "succeeded") {
      navigate("/user-rides");
    }
  }, [bookingStatus, navigate]);

  if (!ride) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:text-blue-700"
        disabled={isWaitingForDriver}
      >
        ← Back to rides
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Booking Details</h2>

        {!connected && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            Not connected to real-time service. You can't book a ride at this
            moment.
          </div>
        )}

        {isWaitingForDriver && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Waiting for driver response...
          </div>
        )}

        {bookingTimedOut && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            No driver available at the moment. Redirecting to home page...
          </div>
        )}

        <div className="mb-6 space-y-2">
          <p>
            <span className="font-semibold">From:</span> {ride.from}
          </p>
          <p>
            <span className="font-semibold">To:</span> {ride.to}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(ride.date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Available Seats:</span>{" "}
            {ride.seatsAvailable}
          </p>
          <p>
            <span className="font-semibold">Price per seat:</span> ₹{ride.price}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {currentRideStatus}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Seats
              <input
                type="number"
                min="1"
                max={ride.seatsAvailable}
                value={seatsToBook}
                onChange={(e) => setSeatsToBook(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={isWaitingForDriver || bookingTimedOut}
              />
            </label>
          </div>

          <div className="text-lg font-semibold">
            Total Price: ₹{(ride.price * seatsToBook).toFixed(2)}
          </div>

          <button
            type="submit"
            disabled={
              !connected ||
              isWaitingForDriver ||
              bookingTimedOut ||
              bookingStatus === "loading"
            }
            className={`w-full py-2 px-4 rounded-md text-white ${
              !connected ||
              isWaitingForDriver ||
              bookingTimedOut ||
              bookingStatus === "loading"
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isWaitingForDriver
              ? "Waiting for Driver..."
              : bookingStatus === "loading"
              ? "Booking..."
              : "Request Ride"}
          </button>
        </form>

        {bookingStatus === "succeeded" && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
            Booking confirmed! Redirecting to your rides...
          </div>
        )}

        {bookingStatus === "failed" && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {bookingError}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
