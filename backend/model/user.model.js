import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    bookedRides: [
      {
        rideId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "rides",
        },
        seatsBooked: {
          type: Number,
          required: function () {
            return this.rideId !== undefined;
          },
        },
        status: {
          type: String,
          enum: ["Pending", "Confirmed", "Cancelled"],
          default: "Pending",
        },
        bookingDate: { type: Date, default: Date.now },
        distance: {
          type: Number, // in kilometers
          default: null,
        },
        estimatedDuration: {
          type: Number, // in minutes
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customers", customerSchema);

export default Customer;
