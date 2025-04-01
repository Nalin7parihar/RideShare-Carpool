import Rides from "../model/rides.model.js";
import Driver from "../model/driver.model.js";
import { getRouteInfo } from "../config/routeService.js";

const offerRide = async (req, res) => {
  try {
    const {
      from,
      to,
      time,
      date,
      price,
      seatsAvailable,
      id,
      fromCoordinates,
      toCoordinates,
    } = req.body;

    // Input validation
    if (!from || !to || !time || !price || !seatsAvailable || !id) {
      return res.status(400).json({
        message: "Missing required ride details",
      });
    }

    // Validate driver exists
    const driverObj = await Driver.findById(id);
    if (!driverObj) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    // Calculate route information if coordinates are provided
    let distance = null;
    let estimatedDuration = null;

    if (fromCoordinates && toCoordinates) {
      try {
        // Convert object coordinates to arrays [longitude, latitude]
        const startCoords = [fromCoordinates.lon, fromCoordinates.lat];
        const endCoords = [toCoordinates.lon, toCoordinates.lat];

        const routeInfo = await getRouteInfo(startCoords, endCoords);
        distance = routeInfo.distance;
        estimatedDuration = routeInfo.duration;
      } catch (error) {
        console.error("Error calculating route:", error);
        // Continue creating ride even if route calculation fails
      }
    }

    // Create new ride
    const newRide = await Rides.create({
      from,
      to,
      time,
      date,
      price,
      seatsAvailable,
      driver: id,
      status: "active",
      fromCoordinates,
      toCoordinates,
      distance,
      estimatedDuration,
    });

    // Update driver's rides offered
    driverObj.ridesOffered.push(newRide._id);
    await driverObj.save();

    // Respond with created ride
    res.status(201).json({
      message: "Ride offered successfully",
      ride: newRide,
    });
  } catch (error) {
    console.error("Error offering ride:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const fetchRide = async (req, res) => {
  const from = req.body.pickup;
  const to = req.body.dropoff;
  const { date } = req.body;
  const { fromCoordinates } = req.body;
  const { toCoordinates } = req.body;

  if (!from || !to || !date) {
    return res.status(400).json({
      message: "Missing required ride details",
    });
  }
  try {
    const query = {
      ...(from && { from: { $regex: new RegExp(from, "i") } }),
      ...(to && { to: { $regex: new RegExp(to, "i") } }),
      status: "active",
    };

    let fetchedRides = await Rides.find(query).populate("driver");

    // Calculate route information if coordinates are provided
    let distance = null;
    let estimatedDuration = null;

    if (fromCoordinates && toCoordinates) {
      try {
        // Convert object coordinates to arrays [longitude, latitude]
        const startCoords = [fromCoordinates.lon, fromCoordinates.lat];
        const endCoords = [toCoordinates.lon, toCoordinates.lat];
        console.log(JSON.stringify({ startCoords, endCoords }));
        const routeInfo = await getRouteInfo(startCoords, endCoords);
        distance = routeInfo.distance;
        estimatedDuration = routeInfo.duration;
      } catch (error) {
        console.error("Error calculating route:", error);
        // Continue even if route calculation fails
      }
    }

    // Add route information to each ride in fetchedRides
    fetchedRides = fetchedRides.map((ride) => {
      return {
        ...ride.toObject(),
        fromCoordinates: fromCoordinates,
        toCoordinates: toCoordinates,
        distance: distance,
        estimatedDuration: estimatedDuration,
      };
    });

    res.json(fetchedRides);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const completeRide = async (req, res) => {
  const { id } = req.params;

  const updatedRide = await Rides.findByIdAndUpdate(
    id,
    { status: "completed" },
    {
      new: true,
      runValidators: true,
    }
  );

  const driver = await Rides.findById(id).populate("driver");
  driver.totalRides += 1;
  if (!updatedRide) {
    return res.status(404).json({ success: false, message: "Ride not found" });
  }

  res.json(updatedRide);
};

const deleteRide = async (req, res) => {
  const { id } = req.params;

  const deletedRide = await Rides.findByIdAndDelete(id);

  if (!deletedRide)
    return res.status(404).json({ success: false, message: "Ride not found" });

  res.json(deletedRide);
};

const updatedRide = async (req, res) => {
  const { id } = req.params;

  const updates = req.body;
  const updatedRide = await Rides.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedRide) {
    return res.status(404).json({ success: false, message: "Ride not found" });
  }

  res.json(updatedRide);
};

const getDriverRides = async (req, res) => {
  try {
    const { driverId } = req.params;

    // Validate driver ID
    if (!driverId) {
      return res.status(400).json({
        message: "Driver ID is required",
      });
    }

    // Find all rides associated with this driver
    const rides = await Rides.find({ driver: driverId })
      .sort({ date: -1, time: -1 }) // Sort by date and time, newest first
      .populate("driver"); // Include driver details

    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching driver rides:", error);
    res.status(500).json({
      message: "Failed to fetch driver rides",
      error: error.message,
    });
  }
};

export {
  offerRide,
  fetchRide,
  completeRide,
  deleteRide,
  updatedRide,
  getDriverRides,
};
