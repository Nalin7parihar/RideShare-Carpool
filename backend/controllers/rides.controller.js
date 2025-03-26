import Rides from "../model/rides.model.js";
import Driver from "../model/driver.model.js";

const offerRide = async (req, res) => {
  try {
    const { from, to, time, price, seatsAvailable, id } = req.body;
    
    // Input validation
    if (!from || !to || !time || !price || !seatsAvailable || !id) {
      return res.status(400).json({ 
        message: 'Missing required ride details' 
      });
    }

    // Validate driver exists
    const driverObj = await Driver.findById(id);
    if (!driverObj) {
      return res.status(404).json({ 
        message: 'Driver not found' 
      });
    }


    // Create new ride
    const newRide = await Rides.create({
      from,
      to,
      time,
      price,
      seatsAvailable,
      driver : id
    });
    
    // Update driver's rides offered
    driverObj.ridesOffered.push(newRide._id);
    await driverObj.save();
    
    // Respond with created ride
    res.status(201).json({
      message: 'Ride offered successfully',
      ride: newRide
    });

  } catch (error) {
    console.error('Error offering ride:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};

export {offerRide};