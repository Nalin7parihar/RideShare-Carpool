import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
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
  }
  },
  {
    timestamps : true
  }
);

const Customer = mongoose.model('Customers', customerSchema);

export default Customer;