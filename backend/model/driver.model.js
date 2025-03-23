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
  }
  }
)

const Driver = mongoose.model('Drivers', driverSchema);
export default Driver;