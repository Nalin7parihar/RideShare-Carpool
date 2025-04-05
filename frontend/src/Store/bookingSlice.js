import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Add this new action to fetch user bookings
export const fetchUserBookings = createAsyncThunk(
  "booking/fetchUserBookings",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://rideshare-carpool.onrender.com/api/bookings/user/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for booking a ride
export const bookRide = createAsyncThunk(
  "booking/bookRide",
  async (bookingDetails, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://rideshare-carpool.onrender.com/api/bookings",
        bookingDetails
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  message: null,
  userBookings: [], // Could store user's booked rides
};

// Ride booking slice
const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookRide.pending, (state) => {
        state.status = "loading";
      })
      .addCase(bookRide.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.userBookings.push(action.payload);
      })
      .addCase(bookRide.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to book ride";
      })
      .addCase(fetchUserBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userBookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch bookings";
      });
  },
});

// Export actions
export const { resetBookingStatus } = bookingSlice.actions;

// Export selectors
export const selectBookingStatus = (state) => state.booking.status;
export const selectBookingError = (state) => state.booking.error;
export const selectBookingMessage = (state) => state.booking.message;
export const selectUserBookings = (state) => state.booking.userBookings;

// Export reducer
export default bookingSlice.reducer;