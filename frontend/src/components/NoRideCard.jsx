import React from "react";

const NoRideCard = () => {
  return (
    <div className="border border-dashed border-gray-300 rounded-lg p-8 mb-6 bg-gray-50 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 mx-auto text-gray-400 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p className="text-gray-600 text-lg">No active rides</p>
      <p className="text-gray-500 text-sm mt-1">
        Offer a new ride to get started
      </p>
    </div>
  );
};

export default NoRideCard;
