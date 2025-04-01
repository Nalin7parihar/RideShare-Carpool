import express from "express";
import {
  bookRide,
  getUserBookings,
} from "../controllers/bookRide.controller.js";
const bookingRoute = express.Router();

bookingRoute.post("/", bookRide);

// New route to get user bookings
bookingRoute.get("/user/:userId", getUserBookings);

export default bookingRoute;
