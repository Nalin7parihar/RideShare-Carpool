import React from 'react'
import { Clock, Calendar, MapPin, Users, Car, Info, CreditCard } from 'lucide-react';
const Rideinfo = ({rides}) => {

  // Handle booking a ride
    const handleBookRide = (rideId) => {
      console.log(`Booking ride with ID: ${rideId}`);
      // This would redirect to booking process or show booking modal
    };
  
    // Handle viewing ride details
    const handleViewDetails = (rideId) => {
      console.log(`Viewing details for ride with ID: ${rideId}`);
      // This would redirect to ride details page or show details modal
    };
  return (
    <>
    {rides.map((ride) => (
      <div key={ride.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row">
          {/* Driver Profile Section */}
          <div className="md:w-1/4 flex flex-col items-center mb-4 md:mb-0">
            <img 
              src={ride.driver.profilePic} 
              alt={`${ride.driver.name}'s profile`} 
              className="w-16 h-16 rounded-full object-cover mb-2"
            />
            <h3 className="font-medium">{ride.driver.name}</h3>
            <div className="flex items-center mt-1">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{ride.driver.rating}</span>
            </div>
          </div>
          
          {/* Ride Details Section */}
          <div className="md:w-2/4 md:pl-4">
            <div className="flex items-start mb-2">
              <MapPin size={18} className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium">From: {ride.pickup}</div>
                <div className="font-medium">To: {ride.dropoff}</div>
              </div>
            </div>
            
            <div className="flex items-center mb-2">
              <Calendar size={18} className="text-blue-500 mr-2 flex-shrink-0" />
              <span>{ride.date}</span>
            </div>
            
            <div className="flex items-center mb-2">
              <Clock size={18} className="text-blue-500 mr-2 flex-shrink-0" />
              <span>{ride.time} • {ride.estimatedTravelTime}</span>
            </div>
            
            <div className="flex items-center mb-2">
              <Car size={18} className="text-blue-500 mr-2 flex-shrink-0" />
              <span>{ride.vehicle.model} • {ride.vehicle.licensePlate}</span>
            </div>
          </div>
          
          {/* Price and Booking Section */}
          <div className="md:w-1/4 flex flex-col items-center justify-between">
            <div className="text-center">
              <div className="font-bold text-xl text-green-600">${ride.pricePerSeat.toFixed(2)}</div>
              <div className="text-sm text-gray-500">per seat</div>
            </div>
            
            <div className="flex items-center mb-4">
              <Users size={18} className="text-blue-500 mr-2 flex-shrink-0" />
              <span className="font-medium">{ride.seatsAvailable} {ride.seatsAvailable === 1 ? 'seat' : 'seats'} left</span>
            </div>
            
            <div className="flex flex-col space-y-2 w-full">
              <button 
                onClick={() => handleViewDetails(ride.id)} 
                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Info size={16} className="mr-2" />
                View Details
              </button>
              <button 
                onClick={() => handleBookRide(ride.id)} 
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <CreditCard size={16} className="mr-2" />
                Book Ride
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
    </>
  )
}

export default Rideinfo