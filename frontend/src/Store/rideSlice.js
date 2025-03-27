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

const rideSlice = createSlice({
  name: "rides",
  initialState: {
    rides: [],
    status: "idle",
    error: null,
    rideStatus : "active"
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
        state.rides.push(action.payload);
      })
      .addCase(offerRides.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
    });
  }});

export default rideSlice.reducer;
