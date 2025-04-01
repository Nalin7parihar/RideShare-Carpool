import Rides from "../model/rides.model.js";
import Customer from "../model/user.model.js";
import { getRouteInfo } from "../config/routeService.js";

const bookRide = async (req, res) => {
  const { rideId, userId, seatsBooked } = req.body;

  try {
    const ride = await Rides.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not Found" });

    if (ride.seatsAvailable < seatsBooked) {
      return res.status(400).json({ message: "Not enough seats" });
    }

    // Get route information if coordinates are available
    let routeInfo = null;
    if (ride.fromCoordinates && ride.toCoordinates) {
      try {
        routeInfo = await getRouteInfo(
          ride.fromCoordinates,
          ride.toCoordinates
        );
      } catch (routeError) {
        console.error("Error getting route information:", routeError);
        // Continue with booking even if route calculation fails
      }
    }

    ride.seatsAvailable -= seatsBooked;
    ride.passengers.push(userId);

    // Add route information if available
    if (routeInfo) {
      ride.distance = routeInfo.distance;
      ride.estimatedDuration = routeInfo.duration;
    }

    await ride.save();

    const customer = await Customer.findById(userId);
    if (!customer) return res.status(404).json({ message: "User not found" });

    customer.bookedRides.push({
      rideId,
      seatsBooked,
      status: "Confirmed",
      bookingDate: new Date(),
      distance: routeInfo?.distance,
      estimatedDuration: routeInfo?.duration,
    });
    await customer.save();

    res.status(201).json({
      message: "Ride booked successfully!",
      rideId,
      userId,
      seatsBooked,
      status: "Confirmed",
      distance: routeInfo?.distance,
      estimatedDuration: routeInfo?.duration,
    });
  } catch (error) {
    console.error("Error booking ride:", error);
    res.status(500).json({ message: "Server error while booking ride" });
  }
};

// New function to get user bookings
const getUserBookings = async (req, res) => {
  const { userId } = req.params;

  try {
    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all booked rides for the user
    const bookings = customer.bookedRides || [];

    // If no bookings, return empty array
    if (bookings.length === 0) {
      return res.status(200).json([]);
    }

    // Get full ride details for each booking
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const ride = await Rides.findById(booking.rideId);
        if (!ride) {
          return null; // Skip if ride not found
        }

        return {
          _id: booking._id || booking.rideId, // Use booking ID if available
          seatsBooked: booking.seatsBooked,
          status: booking.status,
          bookingDate: booking.bookingDate || new Date(),
          ride: {
            _id: ride._id,
            from: ride.from,
            to: ride.to,
            date: ride.date,
            time: ride.time,
            price: ride.price,
            driverId: ride.driver._id,
            status: ride.status,
          },
        };
      })
    );

    // Filter out null values (rides that weren't found)
    const validBookings = bookingsWithDetails.filter(
      (booking) => booking !== null
    );

    res.status(200).json(validBookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
};

export { bookRide, getUserBookings };
