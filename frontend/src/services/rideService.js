import axios from 'axios';


const RideService = {
  offerRide: async (rideDetails) => {
    try {
        // Create FormData object
        
        // Append all ride details to FormData
        // Make API call with form data
        const response = await axios.post('https://rideshare-carpool.onrender.com/api/rides/offerRide', rideDetails, {
        
        });

        // Return successful response
        return response.data;

    } catch (error) {
        // Handle different types of errors
        if (error.response) {
            // Server responded with an error
            console.error('Ride offer failed:', error.response.data);
            throw new Error(error.response.data.message || 'Failed to offer ride');
        } else if (error.request) {
            // No response received
            console.error('No response received:', error.request);
            throw new Error('No response from server. Please check your connection.');
        } else {
            // Error setting up the request
            console.error('Error setting up ride offer request:', error.message);
            throw error;
        }
    }
    },
    fetchRides : async (rideParams) =>{
        const response = await axios.post('https://rideshare-carpool.onrender.com/api/rides/fetchRide',rideParams);
        console.log("Response : ",response.data);
        return response.data;
    },
    updateRide: async (rideData) => {
        console.log("the acquired data :",rideData);
        try {
          const response = await axios.patch(`https://rideshare-carpool.onrender.com/api/rides/updateRide/${rideData.id}`, rideData,{
            headers : {
                "Content-Type" : "application/json"
            }
          });
          console.log(response.data);
          return response.data;
        } catch (error) {
          throw error;
        }
      },
      
      // Complete a ride
      completeRide: async (rideId) => {
        try {
          const response = await axios.patch(`https://rideshare-carpool.onrender.com/api/rides/completeRide/${rideId}`);
          return response.data;
        } catch (error) {
          throw error;
        }
      },
      
      // Delete a ride
      deleteRide: async (rideId) => {
        try {
          await axios.delete(`https://rideshare-carpool.onrender.com/api/rides/deleteRide/${rideId}`);
          return rideId; // Return the ID to be used in the Redux state update
        } catch (error) {
          throw error;
        }
      }
};

export default RideService;