import {configureStore} from '@reduxjs/toolkit';
import   userReducer from './userSlice';
import ridesReducer from './rideSlice';
import driverReducer from './driverSlice';
export const store = configureStore({
  reducer : {
    user : userReducer,
     rides : ridesReducer,
     driver : driverReducer,
    // notification : notificationReducer
  }
})