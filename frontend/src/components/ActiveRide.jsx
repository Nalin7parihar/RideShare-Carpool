import React from "react";

const ActiveRideCard = ({
  currentRide,
  onUpdate,
  onComplete,
  onDelete,
  onStartRide,
  onEndRide,
  onReachedPickup,
  onAcceptBooking,
  onDeclineBooking,
  pendingBookings,
  socketConnected,
  rideStatuses,
}) => {
  // Add null check and fallback for ride data
  const ride = currentRide?.ride || {};
  const rideId = ride?._id;
  const currentStatus = rideStatuses?.[rideId] || ride?.status;

  // Check if there are pending bookings for this ride
  const hasPendingBookings = pendingBookings && pendingBookings.length > 0;

  return (
    <div className="border rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 shadow-lg mb-6 overflow-hidden">
      <div className="bg-amber-500 px-4 py-2">
        <h3 className="text-lg font-bold text-white">Active Ride</h3>
      </div>

      {/* Pending Booking Notification */}
      {hasPendingBookings && (
        <div className="bg-yellow-100 border-b border-yellow-200 p-4">
          <div className="flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <h4 className="text-lg font-semibold text-yellow-800">
              New Ride Request!
            </h4>
          </div>
          <p className="mb-3 text-yellow-700">
            A passenger has requested to join your ride. Would you like to
            accept?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onAcceptBooking}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Accept Ride
            </button>
            <button
              onClick={onDeclineBooking}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Decline Ride
            </button>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-blue-700 font-bold text-xl">
              {ride.from || "N/A"} → {ride.to || "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Date</p>
            <p className="text-gray-800 font-medium">{ride.date || "N/A"}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Time</p>
            <p className="text-gray-800 font-medium">{ride.time || "N/A"}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Price</p>
            <p className="text-green-600 font-bold">₹{ride.price || "0"}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Seats Available</p>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <p className="text-blue-600 font-bold">
                {ride.seatsAvailable || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Ride status and socket connection status */}
        <div className="bg-white p-3 rounded-lg shadow-sm mb-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Ride Status</p>
              <p className="text-blue-600 font-medium">
                {currentStatus || "Active"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Socket Connection</p>
              <p
                className={
                  socketConnected
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {socketConnected ? "Connected" : "Disconnected"}
              </p>
            </div>
          </div>
        </div>

        {/* Ride stage buttons based on status */}
        {(!currentStatus ||
          currentStatus === "active" ||
          currentStatus === "Accepted") && (
          <div className="mb-4">
            <button
              onClick={onReachedPickup}
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center mb-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Arrived at Pickup
            </button>
          </div>
        )}

        {currentStatus === "atPickup" && (
          <div className="mb-4">
            <button
              onClick={onStartRide}
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-sm flex items-center justify-center mb-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Start Ride
            </button>
          </div>
        )}

        {currentStatus === "inProgress" && (
          <div className="mb-4">
            <button
              onClick={onEndRide}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center mb-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              End Ride
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onUpdate}
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Update Ride
          </button>
          <button
            onClick={onComplete}
            className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Complete Ride
          </button>
          <button
            onClick={onDelete}
            className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveRideCard;
