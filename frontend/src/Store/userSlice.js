import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../services/authService";


const initialState = {
  user : JSON.parse(localStorage.getItem("user")) || null,
  loading : false,
  error : null,
}

export const signInWithGoogle = createAsyncThunk(
  "user/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const user = await AuthService.signInwithGoogle();
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUpWithEmail = createAsyncThunk(
  "user/signUpWithEmail",
  async ({ email, password,fullname }, { rejectWithValue }) => {
    console.log("Email : ",email);
    console.log("Password : ",password);
    console.log("Fullname : ",fullname);
    try {
      const user = await AuthService.signUpwithEmail(email,password,fullname);
      console.log("User : ",user);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithEmail = createAsyncThunk(
  "user/signInWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await AuthService.signInwithEmail(email,password);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  await AuthService.logout();
  return null;
});

const userSlice = createSlice({
  name : "user",
  initialState,
  extraReducers : (builder) => {
    builder
       // Google Sign-In
       .addCase(signInWithGoogle.pending, (state) => {
        
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Email Sign-Up
      .addCase(signUpWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        console.log("My action payload : ",action.payload);
        state.user = action.payload;
        state.loading = false;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Email Login
        .addCase(signInWithEmail.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(signInWithEmail.fulfilled, (state, action) => {
          state.user = action.payload;
          state.loading = false;
          localStorage.setItem("user", JSON.stringify(action.payload));
        })
        .addCase(signInWithEmail.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })

      // Logout
        .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user");
      });
  }
})
export default userSlice.reducer;