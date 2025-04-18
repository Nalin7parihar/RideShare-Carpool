import express from "express";
import { verifyRefreshToken } from "../middlewares/auth.js";
import {
  offerRide,
  fetchRide,
  completeRide,
  deleteRide,
  updatedRide,
  getDriverRides,
} from "../controllers/rides.controller.js";

const ridesRoute = express.Router();

ridesRoute.post("/offerRide", offerRide);
ridesRoute.post("/fetchRide", fetchRide);
ridesRoute.patch("/completeRide/:id", completeRide);
ridesRoute.delete("/deleteRide/:id", deleteRide);
ridesRoute.patch("/updateRide/:id", updatedRide);
ridesRoute.get("/driver/:driverId", getDriverRides);

export default ridesRoute;
