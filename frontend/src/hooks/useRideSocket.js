import { useDispatch,useSelector } from "react-redux";
import { useCallback } from "react";
import { emitBookingResponse,emitNewBooking,emitEndRide,emitReachedStartingPoint,emitStartRide } from "../Store/socketSlice";
import { toast } from "react-toastify";
export const useRideSocket = (userType = null) => {
  const dispatch = useDispatch();
  const { connected, rideStatuses, pendingBookings, driverResponses } = useSelector(
    (state) => state.socket
  );

  const reachedPickup = useCallback(
    ({ driverId, rideId }) => {
      if (userType === 'driver') {
        toast.info("Notifying customer you have arrived...");
      }
      
      dispatch(emitReachedStartingPoint({ driverId, rideId }))
        .unwrap()
        .then(() => {
          if (userType === 'driver') {
            toast.success("Customer has been notified of your arrival");
          } else if (userType === 'customer') {
            toast.success("Your driver has arrived at the pickup location");
          }
        })
        .catch((error) => {
          if (userType) {
            toast.error(`Failed to update status: ${error}`);
          }
        });
    },
    [dispatch, userType]
  );

  const startRide = useCallback(
    ({ driverId, rideId }) => {
      if (userType === 'driver') {
        toast.info("Starting ride...");
      }
      
      dispatch(emitStartRide({ driverId, rideId }))
        .unwrap()
        .then(() => {
          if (userType === 'driver') {
            toast.success("Ride started successfully");
          } else if (userType === 'customer') {
            toast.success("Your ride has started");
          }
        })
        .catch((error) => {
          if (userType) {
            toast.error(`Failed to start ride: ${error}`);
          }
        });
    },
    [dispatch, userType]
  );

  const endRide = useCallback(
    ({ driverId, rideId }) => {
      if (userType === 'driver') {
        toast.info("Ending ride...");
      }
      
      dispatch(emitEndRide({ driverId, rideId }))
        .unwrap()
        .then(() => {
          if (userType === 'driver') {
            toast.success("Ride completed successfully");
          } else if (userType === 'customer') {
            toast.success("Your ride has been completed");
          }
        })
        .catch((error) => {
          if (userType) {
            toast.error(`Failed to end ride: ${error}`);
          }
        });
    },
    [dispatch, userType]
  );

  const requestBooking = useCallback(
    ({ customerId, rideId }) => {
      if (!connected) {
        if (userType === 'customer') {
          toast.error("Not connected to service. Please try again later.");
        }
        return Promise.reject("Not connected");
      }
      
      // Generate a session ID for this booking request
      const sessionId = Date.now().toString();
      if (userType === 'customer') {
        toast.info(`Sending booking request...`);
      }
      
      return dispatch(emitNewBooking({ customerId, rideId, sessionId }))
        .unwrap()
        .then((result) => {
          if (userType === 'customer') {
            toast.success("Booking request sent successfully");
          }
          return { ...result, sessionId };
        })
        .catch((error) => {
          if (userType === 'customer') {
            toast.error(`Booking request failed: ${error}`);
          }
          throw error;
        });
    },
    [dispatch, connected, userType]
  );

  const respondToBooking = useCallback(
    ({ driverId, rideId, accepted, sessionId }) => {
      if (userType === 'driver') {
        const message = accepted
          ? "Accepting ride request..."
          : "Declining ride request...";
        toast.info(message);
      }
      
      return dispatch(emitBookingResponse({ driverId, rideId, accepted, sessionId }))
        .unwrap()
        .then((result) => {
          if (userType === 'driver') {
            const successMessage = accepted 
              ? "You accepted the ride request" 
              : "You declined the ride request";
            toast.success(successMessage);
          }
          return result;
        })
        .catch((error) => {
          if (userType === 'driver') {
            toast.error(`Response failed: ${error}`);
          }
          throw error;
        });
    },
    [dispatch, userType]
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