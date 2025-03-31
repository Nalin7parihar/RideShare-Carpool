import express from 'express';
import 'dotenv/config';
import connectDB from './config/mongoDB.js';
import connectCloudinary from './config/cloudinary.js';
import userRoute from './routes/user.route.js';
import driverRoute from './routes/driver.route.js';
import ridesRoute from './routes/rides.route.js';
import bookingRoute from './routes/booking.route.js';
import cors from 'cors';
const app = express();

connectDB();
connectCloudinary();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());


app.get('/',(req,res) =>{
  res.send('API is running...');
});

app.use('/api/users',userRoute);
app.use('/api/driver',driverRoute);
app.use('/api/rides',ridesRoute);
app.use('/api/bookings',bookingRoute);
app.listen(port, () => {
  console.log(`Server launched on port ${port}`);
});

