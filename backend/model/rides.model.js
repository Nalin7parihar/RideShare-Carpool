import mongoose from "mongoose";


const RideSchema = new mongoose.Schema({
  from : {
    type : String,
    required : true
  },
  to : {
    type : String,
    required : true
  },
  time : {
    type : String,
    required : true
  },
  price : {
    type : Number,
    required : true
  },
  seatsAvailable : {
    type : Number,
    required : true,
    default : 4
  },
  driver : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'drivers',
    required : true
  },
  passengers : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'customers',
  }]
})

const  Rides = mongoose.model('Rides',RideSchema);
export default Rides;