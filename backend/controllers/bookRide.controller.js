import Rides from "../model/rides.model.js";
import Customer from "../model/user.model.js";

const bookRide = async (req,res) =>{
    const {rideId,userId, seatsBooked} = req.body;

    const ride = await Rides.findById(rideId);
    if(!ride) return res.status(404).json({message : "Ride not Found"});

    if(ride.seatsAvailable < seatsBooked) {
      return res.status(400).json({message : "Not enough seats"});
    }

    ride.seatsAvailable -= seatsBooked;
    ride.passengers.push(userId);
    await ride.save();

    const customer = await Customer.findById(userId);
    if (!customer) return res.status(404).json({ message: "User not found" });

    customer.bookedRides.push({ rideId, seatsBooked, status: "Confirmed" });
    await customer.save();
    res.status(201).json({ message: "Ride booked successfully!" });
    
}


export {bookRide};