import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../services/authService";

const initialState = {
  driver: JSON.parse(localStorage.getItem("driver")) || null,
  rides: JSON.parse(localStorage.getItem("rides")) || [],
  loading: false,
  error: null,
};
export const signInWithGoogle = createAsyncThunk(
  "driver/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const driver = await AuthService.signInwithGoogle();
      return driver;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUpDriverWithEmail = createAsyncThunk(
  "driver/signUpDriverWithEmail",
  async (formData, { rejectWithValue }) => {
    try {
      const driver = await AuthService.signUpDriverWithEmail(formData);
      return driver;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const driverSignInWithEmail = createAsyncThunk(
  "driver/driverSignInWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const driver = await AuthService.driverSignInwithEmail(email, password);
      return driver;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutDriver = createAsyncThunk(
  "driver/logoutDriver",
  async () => {
    await AuthService.logout();
    return null;
  }
);

export const fetchDriverRides = createAsyncThunk(
  "driver/fetchDriverRides",
  async (driverId, { rejectWithValue }) => {
    try {
      const rides = await AuthService.getDriverRides(driverId);
      return rides;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const driverSlice = createSlice({
  name: "driver",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.driver = action.payload;
        state.loading = false;
        state.error = null;
        localStorage.setItem("driver", JSON.stringify(action.payload)); // ✅ Save to localStorage
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signUpDriverWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUpDriverWithEmail.fulfilled, (state, action) => {
        state.driver = action.payload;
        state.loading = false;
        state.error = null;
        localStorage.setItem("driver", JSON.stringify(action.payload)); // ✅ Save to localStorage
      })
      .addCase(signUpDriverWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(driverSignInWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(driverSignInWithEmail.fulfilled, (state, action) => {
        state.driver = action.payload;
        state.loading = false;
        state.error = null;
        localStorage.setItem("driver", JSON.stringify(action.payload)); // ✅ Save to localStorage
      })
      .addCase(driverSignInWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutDriver.fulfilled, (state, action) => {
        state.driver = action.payload;
        state.rides = [];
        localStorage.removeItem("driver"); // ✅ Remove from localStorage on logout
        localStorage.removeItem("rides"); // Remove rides from localStorage on logout
      })
      .addCase(fetchDriverRides.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDriverRides.fulfilled, (state, action) => {
        console.log("action", action.payload);
        state.rides = action.payload;
        state.loading = false;
        localStorage.setItem("rides", JSON.stringify(action.payload));
      })
      .addCase(fetchDriverRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default driverSlice.reducer;
