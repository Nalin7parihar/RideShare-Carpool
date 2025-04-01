import mongoose from "mongoose";

const RideSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  fromCoordinates: {
    type: [Number], // [longitude, latitude]
    default: null,
  },
  toCoordinates: {
    type: [Number], // [longitude, latitude]
    default: null,
  },
  distance: {
    type: Number, // in kilometers
    default: null,
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: null,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seatsAvailable: {
    type: Number,
    required: true,
    default: 4,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Drivers",
    required: true,
  },
  passengers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
    },
  ],
  status: {
    type: String,
    default: "active",
  },
});

const Rides = mongoose.model("Rides", RideSchema);
export default Rides;
