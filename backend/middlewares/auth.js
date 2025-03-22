import jwt from "jsonwebtoken";
import Customer from "../model/user.model.js";
import { generateAcessToken,generateRefreshToken } from "../controllers/user.controller.js";
const verifyAcessToken = async (req,res,next) =>{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null) return res.sendStatus(401);
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
    if(err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}

const verifyRefreshToken = async (req,res,next) =>{
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }
    
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user with this refresh token
    const user = await Customer.findOne({ _id: decoded.id });
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    
    // Generate new access token
    const accessToken = generateAcessToken(user);
    
    // Send new access token
    res.status(200).json({ accessToken });
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
    
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export {verifyAcessToken,verifyRefreshToken};