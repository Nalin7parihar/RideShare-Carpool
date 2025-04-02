import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ridesReducer from "./rideSlice";
import driverReducer from "./driverSlice";
import bookingReducer from "./bookingSlice";
import socketReducer from "./socketSlice";
import { socketToastMiddleware } from "./socketMiddleware";
export const store = configureStore({
  reducer: {
    user: userReducer,
    rides: ridesReducer,
    driver: driverReducer,
    booking: bookingReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketToastMiddleware),
});
