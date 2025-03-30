import React from "react";

const RideModal = ({
  showModal,
  isUpdating,
  rideDetails,
  handleInputChange,
  handleSubmit,
  handleCancel,
}) => {
  return (
    showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {isUpdating ? "Update Ride" : "Offer a Ride"}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              name="from"
              placeholder="From"
              value={rideDetails.from}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="to"
              placeholder="To"
              value={rideDetails.to}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
            />
            <input
              type="time"
              name="time"
              value={rideDetails.time}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="date"
              value={rideDetails.date}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="seatsAvailable"
              placeholder="Seats Available"
              value={rideDetails.seatsAvailable}
              min="1"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Price (₹)"
              value={rideDetails.price}
              min="0"
              step="0.01"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 text-white rounded ${
                  isUpdating
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isUpdating ? "Update Ride" : "Submit Ride"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default RideModal;
