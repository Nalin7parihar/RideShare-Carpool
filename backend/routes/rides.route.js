import express from 'express';
import { verifyRefreshToken } from '../middlewares/auth.js';
import { offerRide } from '../controllers/rides.controller.js';

const ridesRoute = express.Router();


ridesRoute.post('/offerRide',offerRide);




export default ridesRoute;