import Rides from "../model/rides.model.js";
import Driver from "../model/driver.model.js";

const offerRide = async (req, res) => {
  try {
    const { from, to, time,date, price, seatsAvailable, id } = req.body;
    
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
      date,
      price,
      seatsAvailable,
      driver : id,
      status : "active"
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

const fetchRide = async (req,res) =>{
  const from = req.body.pickup;
  const to = req.body.dropoff;
  const seatsAvailable = req.body.passengers;
  const {date} = req.body;

  if(!from || !to || !seatsAvailable || !date){
    return res.status(400).json({ 
      message: 'Missing required ride details' 
    });
  }
  try {
    const query = {
      ...(from && {from: {$regex: new RegExp(from, "i")}}),
      ...(to && {to: {$regex: new RegExp(to, "i")}}),
      ...(seatsAvailable && {seatsAvailable: {$gte: Number(seatsAvailable)}}),
      status: "active"  // Add this condition to only match active rides
    };
    
    let fetchedRides = await Rides.find(query).populate('driver');

    fetchedRides = fetchedRides.map(ride => ({
      ...ride.toObject(),  // Convert Mongoose document to plain object
      price: ride.price * Number(seatsAvailable || 1) // Multiply price by requested passengers
    }));

    res.json(fetchedRides);
    
  }catch (error) {
    res.status(500).json({success : false,error : error.message});
  }
}

const completeRide = async (req,res) =>{
    const {id} = req.params;
    
    const updatedRide = await Rides.findByIdAndUpdate(id,{status : "completed"},{
      new : true,
      runValidators : true
    })
    
    if(!updatedRide){
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    res.json(updatedRide);
}

const deleteRide = async (req,res) =>{
  const {id} = req.params;

  const deletedRide = await Rides.findByIdAndDelete(id);

  if(!deletedRide) return res.status(404).json({success : false,message : "Ride not found"});

  res.json(deletedRide);
}

const updatedRide = async (req,res) => {
  const {id} = req.params;

  const updates = req.body;
  const updatedRide = await Rides.findByIdAndUpdate(id,updates,{new : true,runValidators : true});
  
  if(!updatedRide){
    return res.status(404).json({ success: false, message: "Ride not found" });
  }

  res.json(updatedRide);
}


export {offerRide,fetchRide,completeRide,deleteRide,updatedRide};