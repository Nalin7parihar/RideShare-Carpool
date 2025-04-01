import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bookRide } from '../Store/bookingSlice';

const BookingForm = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [seatsToBook, setSeatsToBook] = useState(1);
  
  // Get the specific ride from your rides state
  const ride = useSelector(state => 
    state.rides.rides.find(r => r._id === rideId));
    
    console.log('My booked Ride',ride);

  const bookingStatus = useSelector(state => state.booking.status);
  const bookingError = useSelector(state => state.booking.error);
  const user = useSelector(state => state.user.user);
  console.log('My User',user);
  useEffect(() => {
    if (!ride) {
      navigate('/bookRide');
    }
  }, [ride, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = dispatch(bookRide({
      rideId: ride._id,
      userId: user.user._id,
      seatsBooked: seatsToBook
    })).unwrap();

    if (result) {
      setTimeout(() => {
        navigate('/user-rides');
      }, 2000);
    }
  };

  if (!ride) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:text-blue-700"
      >
        ← Back to rides
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
        
        <div className="mb-6 space-y-2">
          <p><span className="font-semibold">From:</span> {ride.from}</p>
          <p><span className="font-semibold">To:</span> {ride.to}</p>
          <p><span className="font-semibold">Date:</span> {new Date(ride.date).toLocaleDateString()}</p>
          <p><span className="font-semibold">Available Seats:</span> {ride.seatsAvailable}</p>
          <p><span className="font-semibold">Price per seat:</span> ${ride.price}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Seats
              <input
                type="number"
                min="1"
                max={ride.seatsAvailable}
                value={seatsToBook}
                onChange={(e) => setSeatsToBook(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="text-lg font-semibold">
            Total Price: ${(ride.price * seatsToBook).toFixed(2)}
          </div>

          <button
            type="submit"
            disabled={bookingStatus === 'loading'}
            className={`w-full py-2 px-4 rounded-md text-white ${
              bookingStatus === 'loading'
                ? 'bg-gray-400'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {bookingStatus === 'loading' ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>

        {bookingStatus === 'succeeded' && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
            Booking successful! Redirecting to your rides...
          </div>
        )}

        {bookingStatus === 'failed' && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {bookingError}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;