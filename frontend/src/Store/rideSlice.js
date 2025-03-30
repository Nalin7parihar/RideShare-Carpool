import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import rideService from "../services/rideService";
// Hardcoded ride data (to be replaced with API calls later)
const initialRides = [
  {
    id: 1,
    driver: {
      name: "Sarah Johnson",
      profilePic: "/api/placeholder/64/64",
      rating: 4.8
    },
    pickup: "Downtown Boston",
    dropoff: "Cambridge",
    date: "March 17, 2025",
    time: "09:30 AM",
    seatsAvailable: 2,
    pricePerSeat: 12.50,
    rideType: "Car",
    estimatedTravelTime: "25 min",
    vehicle: {
      model: "Toyota Prius",
      licensePlate: "ABC-1234"
    }
  },
  {
    id: 2,
    driver: {
      name: "Michael Chen",
      profilePic: "/api/placeholder/64/64",
      rating: 4.9
    },
    pickup: "Harvard Square",
    dropoff: "South Station",
    date: "March 17, 2025",
    time: "10:15 AM",
    seatsAvailable: 1,
    pricePerSeat: 15.00,
    rideType: "SUV",
    estimatedTravelTime: "30 min",
    vehicle: {
      model: "Honda CR-V",
      licensePlate: "XYZ-5678"
    }
  },
  {
    id: 3,
    driver: {
      name: "Olivia Martinez",
      profilePic: "/api/placeholder/64/64",
      rating: 4.7
    },
    pickup: "Fenway Park",
    dropoff: "Logan Airport",
    date: "March 17, 2025",
    time: "11:00 AM",
    seatsAvailable: 3,
    pricePerSeat: 18.00,
    rideType: "Car",
    estimatedTravelTime: "35 min",
    vehicle: {
      model: "Nissan Altima",
      licensePlate: "DEF-9012"
    }
  }
];

export const fetchRides = createAsyncThunk("rides/fetchRides", async (searchParams) => {
      try {
        console.log("My search Params",searchParams);
        const fetchedRide = await rideService.fetchRides(searchParams);
        return fetchedRide;
      } catch (error) {
        error.response?.data?.message || error?.message || "Failed to fetch Rides"
      } 
  });


export const offerRides = createAsyncThunk(
  "rides/offerRides", 
  async (rideDetails, { rejectWithValue }) => {
      try {
          const ride = await rideService.offerRide(rideDetails);
          const storedRides = JSON.parse(localStorage.getItem("rides")) || [];
      storedRides.push(ride);
      localStorage.setItem("rides", JSON.stringify(storedRides));
          return ride;
      } catch (error) {
          // Handle potential errors from the ride service
          const errorMessage = 
              error.response?.data?.message || 
              error.message || 
              'Failed to offer ride';
          
          // Reject with a value that can be handled in the reducer
          return rejectWithValue({
              message: errorMessage,
              status: error.response?.status
          });
      }
  }
);

export const updateRide = createAsyncThunk(
  "rides/updateRide",
  async (rideId, { rejectWithValue }) => {
    try {
      const response = await rideService.updateRide(rideId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update ride'
      );
    }
  }
);

export const completeRide = createAsyncThunk(
  "rides/completeRide",
  async (rideId, { rejectWithValue }) => {
    try {
      const response = await rideService.completeRide(rideId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to complete ride'
      );
    }
  }
);

export const deleteRide = createAsyncThunk(
  "rides/deleteRide",
  async (rideId, { rejectWithValue }) => {
    try {
      const response = await rideService.deleteRide(rideId);
      return rideId; // Return the ID to remove it from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete ride'
      );
    }
  }
);

const rideSlice = createSlice({
  name: "rides",
  initialState: {
    rides: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setRides : (state,action) =>{
      state.rides = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRides.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRides.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rides = action.payload;
      })
      .addCase(fetchRides.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(offerRides.pending, (state) => {
        state.status = "loading";
      })
      .addCase(offerRides.fulfilled, (state,action) =>{
        state.status = "succeeded";
        state.rides.unshift(action.payload);
      })
      .addCase(offerRides.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
    })
    .addCase(updateRide.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateRide.fulfilled, (state, action) => {
      state.status = "succeeded";
      console.log(action.payload);
      console.log("this is state", JSON.parse(JSON.stringify(state)));
      
      // Find the ride with matching ID
      const index = state.rides.findIndex(ride => ride.ride._id === action.payload._id);
      console.log("Index Found", index);
      
      if (index !== -1) {
        // Update only the ride part, preserving the structure
        state.rides[index] = {
          ...state.rides[index],  // Keep any other properties
          ride: action.payload     // Update the ride data
        };
      }
    })
    .addCase(updateRide.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(completeRide.pending, (state) => {
      state.status = "loading";
    })
    .addCase(completeRide.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.rides.findIndex(ride => ride.ride._id === action.payload._id);
      if (index !== -1) {
        state.rides[index] = {
          ...state.rides[index],  // Keep any other properties
          ride: action.payload     // Update the ride data
        };
      }
    })
    .addCase(completeRide.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(deleteRide.pending, (state) => {
      state.status = "loading";
    })
    .addCase(deleteRide.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.rides = state.rides.filter(ride => ride.ride._id !== action.payload);
    })
    .addCase(deleteRide.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
  }});

export default rideSlice.reducer;
