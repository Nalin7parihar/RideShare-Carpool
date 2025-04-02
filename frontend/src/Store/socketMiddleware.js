import { toast } from "react-toastify";
import {
  updateRideStatus,
  receiveBookingRequest,
  receiveDriverResponse,
  setError,
} from "./socketSlice";

export const socketToastMiddleware = (store) => (next) => (action) => {
  // Run the action first
  const result = next(action);

  // Show toast notifications based on specific actions
  if (updateRideStatus.match(action)) {
    const { rideId, status } = action.payload;
    toast.info(`Ride #${rideId} status updated to: ${status}`);
  }

  if (receiveBookingRequest.match(action)) {
    const { message } = action.payload;
    toast.success(message || "New booking request received");
  }

  if (receiveDriverResponse.match(action)) {
    const { status, message } = action.payload;
    if (status === "Accepted") {
      toast.success(message || "Driver accepted your request");
    } else {
      toast.warning(message || "Driver rejected your request");
    }
  }

  if (setError.match(action)) {
    toast.error(action.payload);
  }

  return result;
};
