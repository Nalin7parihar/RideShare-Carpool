import express from 'express';
import { verifyRefreshToken } from '../middlewares/auth.js';
import { offerRide,fetchRide } from '../controllers/rides.controller.js';

const ridesRoute = express.Router();


ridesRoute.post('/offerRide',offerRide);
ridesRoute.post('/fetchRide',fetchRide);




export default ridesRoute;