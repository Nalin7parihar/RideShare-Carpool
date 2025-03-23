import express from 'express';
import upload from '../config/multer.js';
import { verifyRefreshToken } from '../middlewares/auth.js';
import { handleDriverLogin, handleDriverSignUp } from '../controllers/driver.controller.js';

const driverRoute = express.Router();

driverRoute.post('/',upload.single('driverLicense'),handleDriverSignUp);
driverRoute.post('/refreshToken',verifyRefreshToken);
driverRoute.post('/login',handleDriverLogin);


export default driverRoute;