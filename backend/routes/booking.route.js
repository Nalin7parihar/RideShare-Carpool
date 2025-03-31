import express from 'express';
import {bookRide} from '../controllers/bookRide.controller.js'
const bookingRoute = express.Router();


bookingRoute.post('/',bookRide);


export default bookingRoute;