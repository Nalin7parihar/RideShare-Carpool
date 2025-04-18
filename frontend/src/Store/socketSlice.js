import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

let socket;

// Initialize socket connection
export const initializeSocket = createAsyncThunk(
  "socket/initialize",
  async ( payload, {dispatch, rejectWithValue }) => {
    try {
      // Use the provided serverUrl or fall back to an environment variable
      const socketUrl = "https://rideshare-carpool.onrender.com";

      if (!socketUrl) {
        return rejectWithValue("Socket server URL is required");
      }

      // Configure socket with CORS options for cross-origin communication
      socket = io(socketUrl, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Set up socket event listeners
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        dispatch(setConnected(true));
        dispatch(setSocketId(socket.id));
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        dispatch(setError(`Connection error: ${error.message}`));
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        dispatch(setConnected(false));
      });

      socket.on("rideStatusUpdate", (data) => {
        console.log("Ride status update received:", data);
        dispatch(updateRideStatus(data));
      });

      socket.on("bookingConfirmation", (data) => {
        console.log("Booking confirmation received:", data);
        // Clear any existing responses for this ride before adding the new confirmation
        // This ensures we start fresh with each new booking session
        dispatch(clearResponsesForRide(data.rideId));
        dispatch(receiveBookingRequest(data));
      });

      socket.on("driverResponse", (data) => {
        console.log("Driver response received:", data);
        dispatch(receiveDriverResponse(data));
      });

      socket.on("bookingError", (data) => {
        console.error("Booking error:", data.message);
        dispatch(setError(data.message));
      });

      socket.on("responseError", (data) => {
        console.error("Response error:", data.message);
        dispatch(setError(data.message));
      });

      return socketUrl;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Emit events
export const emitReachedStartingPoint = createAsyncThunk(
  "socket/reachedStartingPoint",
  async ({ driverId, rideId }, { getState, rejectWithValue }) => {
    try {
      const {
        socket: { connected },
      } = getState();

      if (!connected || !socket) {
        return rejectWithValue("Socket not connected");
      }

      socket.emit("reachedStartingPoint", { driverId, rideId });
      return { rideId, status: "atPickup" };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const emitStartRide = createAsyncThunk(
  "socket/startRide",
  async ({ driverId, rideId }, { getState, rejectWithValue }) => {
    try {
      const {
        socket: { connected },
      } = getState();

      if (!connected || !socket) {
        return rejectWithValue("Socket not connected");
      }

      socket.emit("startRide", { driverId, rideId });
      return { rideId, status: "inProgress" };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const emitEndRide = createAsyncThunk(
  "socket/endRide",
  async ({ driverId, rideId }, { getState, rejectWithValue }) => {
    try {
      const {
        socket: { connected },
      } = getState();

      if (!connected || !socket) {
        return rejectWithValue("Socket not connected");
      }

      socket.emit("endRide", { driverId, rideId });
      return { rideId, status: "completed" };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const emitNewBooking = createAsyncThunk(
  "socket/newBooking",
  async ({ customerId, rideId, sessionId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const {
        socket: { connected },
      } = getState();

      if (!connected || !socket) {
        return rejectWithValue("Socket not connected");
      }

      // Clear previous responses for this ride before sending a new booking request
      dispatch(clearResponsesForRide(rideId));
      
      socket.emit("newBooking", { customerId, rideId, sessionId });
      return { customerId, rideId, sessionId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const emitBookingResponse = createAsyncThunk(
  "socket/bookingResponse",
  async ({ driverId, rideId, accepted, sessionId }, { getState, rejectWithValue }) => {
    try {
      const {
        socket: { connected },
      } = getState();

      if (!connected || !socket) {
        return rejectWithValue("Socket not connected");
      }

      socket.emit("bookingResponse", { driverId, rideId, accepted, sessionId });
      return { driverId, rideId, accepted, sessionId, status: accepted ? "Accepted" : "Rejected" };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Disconnect socket
export const disconnectSocket = createAsyncThunk(
  "socket/disconnect",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      if (socket) {
        socket.disconnect();
        dispatch(setConnected(false));
        dispatch(setSocketId(null));
      }
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    connected: false,
    socketId: null,
    rideStatuses: {}, // { rideId: 'status' }
    pendingBookings: [], // Array of booking requests
    driverResponses: [], // Array of driver responses
    loading: false,
    error: null,
    socketUrl: null,
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    },
    updateRideStatus: (state, action) => {
      const { rideId, status } = action.payload;
      state.rideStatuses[rideId] = status;
    },
    receiveBookingRequest: (state, action) => {
      // Prevent duplicate pending bookings
      const exists = state.pendingBookings.some(
        booking => booking.rideId === action.payload.rideId && 
                   booking.sessionId === action.payload.sessionId
      );
      if (!exists) {
        state.pendingBookings.push(action.payload);
      }
    },
    
    receiveDriverResponse: (state, action) => {
      const { rideId, sessionId } = action.payload;
      
      // Prevent duplicate driver responses for the same session
      const exists = state.driverResponses.some(
        response => response.rideId === rideId && 
                    response.sessionId === sessionId
      );
      if (!exists) {
        state.driverResponses.push(action.payload);
      }
    },
    clearBookingRequests: (state) => {
      state.pendingBookings = [];
    },
    clearDriverResponses: (state) => {
      state.driverResponses = [];
    },
    clearResponsesForRide: (state, action) => {
      const rideId = action.payload;
      // Clear previous responses for this specific ride
      state.driverResponses = state.driverResponses.filter(
        response => response.rideId !== rideId
      );
      // Also clear pending bookings for this ride
      state.pendingBookings = state.pendingBookings.filter(
        booking => booking.rideId !== rideId
      );
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize socket
      .addCase(initializeSocket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeSocket.fulfilled, (state, action) => {
        state.loading = false;
        state.socketUrl = action.payload;
      })
      .addCase(initializeSocket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to initialize socket";
      })

      // Emit events
      .addCase(emitReachedStartingPoint.fulfilled, (state, action) => {
        const { rideId, status } = action.payload;
        state.rideStatuses[rideId] = status;
      })
      .addCase(emitReachedStartingPoint.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(emitStartRide.fulfilled, (state, action) => {
        const { rideId, status } = action.payload;
        state.rideStatuses[rideId] = status;
      })
      .addCase(emitStartRide.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(emitEndRide.fulfilled, (state, action) => {
        const { rideId, status } = action.payload;
        state.rideStatuses[rideId] = status;
      })
      .addCase(emitEndRide.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(emitNewBooking.fulfilled, (state, action) => {
        // Clear old responses for this ride when a new booking is made
        const { rideId } = action.payload;
        state.driverResponses = state.driverResponses.filter(
          response => response.rideId !== rideId
        );
      })
      .addCase(emitNewBooking.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(emitBookingResponse.fulfilled, (state, action) => {
        // Update state with driver response
        const newResponse = action.payload;
        
        // Check if we already have a response for this session
        const existingIndex = state.driverResponses.findIndex(
          resp => resp.rideId === newResponse.rideId && resp.sessionId === newResponse.sessionId
        );
        
        if (existingIndex >= 0) {
          // Update existing response
          state.driverResponses[existingIndex] = newResponse;
        } else {
          // Add new response
          state.driverResponses.push(newResponse);
        }
      })
      .addCase(emitBookingResponse.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Disconnect socket
      .addCase(disconnectSocket.fulfilled, (state) => {
        state.connected = false;
        state.socketId = null;
      })
      .addCase(disconnectSocket.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  setConnected,
  setSocketId,
  updateRideStatus,
  receiveBookingRequest,
  receiveDriverResponse,
  clearBookingRequests,
  clearDriverResponses,
  clearResponsesForRide,
  setError,
  clearError,
} = socketSlice.actions;

export default socketSlice.reducer;