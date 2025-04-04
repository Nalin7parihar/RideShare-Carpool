import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserBookings } from "../Store/bookingSlice";
import { Link } from "react-router-dom";

const UserRides = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const bookings = useSelector((state) => state.booking.userBookings || []);
  const loading = useSelector((state) => state.booking.status === "loading");
  const error = useSelector((state) => state.booking.error);

  useEffect(() => {
    if (user?.user?._id) {
      dispatch(fetchUserBookings(user.user._id));
    }
    console.log("User Bookings", bookings);
  }, [dispatch, user]);

  // Sort bookings by date (most recent first)
  const sortedBookings = [...bookings].sort((a, b) => {
    // Check if ride data exists before attempting to sort
    if (!a.ride?.date || !b.ride?.date) return 0;

    const dateA = new Date(a.ride.date);
    const dateB = new Date(b.ride.date);
    return dateB - dateA;
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Loading your rides...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Error loading rides</h2>
        <div className="bg-red-100 p-4 rounded-lg text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Upcoming Rides</h2>

      {bookings.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">
            You don't have any upcoming rides.
          </p>
          <Link
            to="/bookRide"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Book a Ride
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-medium">
                    {booking.ride?.from} to {booking.ride?.to}
                  </h3>
                  <p className="text-gray-600">
                    {booking.ride?.date
                      ? new Date(booking.ride.date).toLocaleDateString()
                      : "N/A"}
                    {booking.ride?.time ? ` at ${booking.ride.time}` : ""}
                  </p>
                  <div className="mt-2">
                    <p>
                      <span className="font-medium">Seats booked:</span>{" "}
                      {booking.seatsBooked}
                    </p>
                    <p>
                      <span className="font-medium">Total price:</span> ₹
                      {booking.ride?.price
                        ? (booking.ride.price * booking.seatsBooked).toFixed(2)
                        : "N/A"}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Booking ID: {booking._id}
                    </p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {booking.status || "Confirmed"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRides;
