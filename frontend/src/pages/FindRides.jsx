import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Rideinfo from '../components/rideinfo';
const FindRides = () => {
  
  
  const rides = useSelector((state) => state.rides.rides);
  const [hasResults, setHasResults] = useState(true);

  

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Available Rides</h2>
      
      {hasResults ? (
        <div className="space-y-4">
          <Rideinfo rides = {rides}/>
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <div className="text-4xl mb-4">🚗</div>
          <h3 className="text-xl font-medium mb-2">No rides available for this route.</h3>
          <p className="text-gray-600">Try adjusting filters or searching for a different route.</p>
        </div>
      )}
    </div>
  );
};

export default FindRides;