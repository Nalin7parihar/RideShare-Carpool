import axios from 'axios';


const RideService = {
  offerRide: async (rideDetails) => {
    try {
        // Create FormData object
        
        console.log('Form Data:', rideDetails);
        // Append all ride details to FormData
        // Make API call with form data
        const response = await axios.post('http://localhost:8080/api/rides/offerRide', rideDetails, {
        
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
}
};

export default RideService;