// useRideSocket.js
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  emitReachedStartingPoint,
  emitStartRide,
  emitEndRide,
  emitNewBooking,
  emitBookingResponse,
} from "../Store/socketSlice";
import { toast } from "react-toastify";

export const useRideSocket = () => {
  const dispatch = useDispatch();
  const { connected, rideStatuses, pendingBookings, driverResponses } = useSelector(
    (state) => state.socket
  );

  const reachedPickup = useCallback(
    ({ driverId, rideId }) => {
      toast.info("Notifying customer you have arrived...");
      dispatch(emitReachedStartingPoint({ driverId, rideId }))
        .unwrap()
        .then(() => {
          toast.success("Customer has been notified of your arrival");
        })
        .catch((error) => toast.error(`Failed to update status: ${error}`));
    },
    [dispatch]
  );

  const startRide = useCallback(
    ({ driverId, rideId }) => {
      toast.info("Starting ride...");
      dispatch(emitStartRide({ driverId, rideId }))
        .unwrap()
        .then(() => {
          toast.success("Ride started successfully");
        })
        .catch((error) => toast.error(`Failed to start ride: ${error}`));
    },
    [dispatch]
  );

  const endRide = useCallback(
    ({ driverId, rideId }) => {
      toast.info("Ending ride...");
      dispatch(emitEndRide({ driverId, rideId }))
        .unwrap()
        .then(() => {
          toast.success("Ride completed successfully");
        })
        .catch((error) => toast.error(`Failed to end ride: ${error}`));
    },
    [dispatch]
  );

  const requestBooking = useCallback(
    ({ customerId, rideId }) => {
      if (!connected) {
        toast.error("Not connected to service. Please try again later.");
        return Promise.reject("Not connected");
      }
      
      toast.info("Sending booking request...");
      return dispatch(emitNewBooking({ customerId, rideId }))
        .unwrap()
        .then((result) => {
          toast.success("Booking request sent successfully");
          return result;
        })
        .catch((error) => {
          toast.error(`Booking request failed: ${error}`);
          throw error;
        });
    },
    [dispatch, connected]
  );

  const respondToBooking = useCallback(
    ({ driverId, rideId, accepted }) => {
      const message = accepted
        ? "Accepting ride request..."
        : "Declining ride request...";
      toast.info(message);
      return dispatch(emitBookingResponse({ driverId, rideId, accepted }))
        .unwrap()
        .then((result) => {
          const successMessage = accepted 
            ? "You accepted the ride request" 
            : "You declined the ride request";
          toast.success(successMessage);
          return result;
        })
        .catch((error) => {
          toast.error(`Response failed: ${error}`);
          throw error;
        });
    },
    [dispatch]
  );

  return {
    connected,
    rideStatuses,
    pendingBookings,
    driverResponses,
    reachedPickup,
    startRide,
    endRide,
    requestBooking,
    respondToBooking,
  };
};