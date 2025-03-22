import express from 'express';
import {handleUserSignUp,handleUserLogin} from "../controllers/user.controller.js";
import { verifyRefreshToken } from '../middlewares/auth.js';
const userRoute = express.Router();


userRoute.post('/',handleUserSignUp);
userRoute.post('/refreshToken',verifyRefreshToken);
userRoute.post('/login',handleUserLogin);

export default userRoute;