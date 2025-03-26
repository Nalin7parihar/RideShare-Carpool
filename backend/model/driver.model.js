import mongoose from "mongoose";


const driverSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  refreshToken : {
    type : String
  },
  carNumber : {
    type : String,
    required : true
  },
  carModel :  {
    type : String,
    required : true
  },
  driverLicense : {
    type : String,
    required : false
  },
  isVerified : {
    type : Boolean,
    default : false
  },
  rating : {
    type : Number,
    default : 0
  },
  totalRides : {
    type : Number,
    default : 0
  },
  availableSeats : {
    type : Number,
    default : 4
  },
  isAvailable : {
    type : Boolean,
    default : true
  },
  ridesOffered : [{type : mongoose.Schema.Types.ObjectId,ref : 'rides'}]
  }

)

const Driver = mongoose.model('Drivers', driverSchema);
export default Driver;