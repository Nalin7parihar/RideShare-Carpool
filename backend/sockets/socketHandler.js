import Rides from "../model/rides.model.js";
import Customer from "../model/user.model.js";
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User Connected : ${socket.id}`);

    socket.on("reachedStartingPoint", async ({ rideId }) => {
      console.log(`Driver reached starting point for ride: ${rideId}`);
      const ride = await Rides.findById(rideId);
      if (ride) {
        ride.status = "At Pickup";
        await ride.save();
        io.emit("rideStatusUpdate", { rideId, status: "At Pickup" });
      }
    });
    socket.on("startRide", async ({ rideId }) => {
      console.log(`Ride Started : ${rideId}`);
      const ride = await Rides.findById(rideId);
      ride.status = "Started";
      await ride.save();
      const populatedRide = await ride.populate("driver");
      const driver = populatedRide.driver;
      driver.isAvailable = false;
      await driver.save();
      io.emit("rideStatusUpdate", { rideId, status: "Started" });
    });

    socket.on("endRide", async ({ rideId }) => {
      console.log(`Ride Ended : ${rideId}`);
      const ride = await Rides.findById(rideId);
      ride.status = "completed";
      await ride.save();
      const populatedRide = await ride.populate("driver");
      const driver = populatedRide.driver;
      driver.isAvailable = true; // Fixed: Should be true when ride ends
      await driver.save();
      io.emit("rideStatusUpdate", { rideId, status: "Ended" });
    });

    socket.on("newBooking", async ({ customerId, rideId }) => {
      console.log(`New Booking by ${customerId}`);
      try {
        const user = await Customer.findById(customerId);
        const booking = user.bookedRides.find((r) => r.rideId === rideId);
        const seats = booking?.seatsBooked;

        // Emit booking confirmation to available drivers
        io.emit("bookingConfirmation", {
          customerId,
          rideId,
          seats,
          message: `${user.name} is requesting a ride for ${seats} seat(s)`,
        });
      } catch (error) {
        console.error("Error processing new booking:", error);
        socket.emit("bookingError", { message: "Failed to process booking" });
      }
    });

    socket.on("bookingResponse", async ({ driverId, rideId, accepted }) => {
      console.log(
        `Booking response from driver ${driverId}: ${
          accepted ? "Accepted" : "Rejected"
        }`
      );
      try {
        const ride = await Rides.findById(rideId);
        if (!ride) {
          socket.emit("responseError", { message: "Ride not found" });
          return;
        }

        if (accepted) {
          // Update ride with driver information
          ride.status = "Accepted";
          await ride.save();

          // Notify customer that driver accepted
          io.emit("driverResponse", {
            rideId,
            driverId,
            status: "Accepted",
            message: "Driver accepted your ride request",
          });
        } else {
          // Notify customer that driver rejected
          ride.status = "active";
          io.emit("driverResponse", {
            rideId,
            driverId,
            status: "Rejected",
            message: "Driver rejected your ride request",
          });
        }
      } catch (error) {
        console.error("Error processing booking response:", error);
        socket.emit("responseError", { message: "Failed to process response" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });
  });
};

export default socketHandler;
