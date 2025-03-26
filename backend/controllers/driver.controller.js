import Driver from "../model/driver.model.js";
import bcrypt from "bcryptjs";
import { generateAcessToken,generateRefreshToken } from "./user.controller.js";
import { v2 as cloudinary } from 'cloudinary';

const handleDriverSignUp = async (req, res) => {
  try {
    const { name, email, password, carNumber, carModel } = req.body;
    
    // Check if required fields are provided
    if (!name || !email || !password || !carNumber || !carModel) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, email, password, carNumber, and carModel"
      });
    }
    
    // Check if email already exists
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(409).json({
        success: false,
        message: "Email already in use"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Set verification status based on license upload
    let driverLicense = null;
    let isVerified = false;    
    if (req.file && req.file.buffer) {
      try {
        // Convert buffer to base64 string for Cloudinary
        const fileStr = req.file.buffer.toString('base64');
        const fileFormat = `data:${req.file.mimetype};base64,${fileStr}`;
    
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(fileFormat, {
          folder: 'driver-licenses',
          resource_type: 'auto'
        });
    
        // Now set driverLicense to the Cloudinary URL
        driverLicense = uploadResult.secure_url;
        isVerified = true; // Set to true after successful upload to Cloudinary
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to upload driver license"
        });
      }
    } else {
      // If license is required, return error
      return res.status(400).json({
        success: false,
        message: "Driver license is required"
      });
    }

    // Create new driver
    const newDriver = await Driver.create({
      name,
      email,
      password: hashedPassword,
      carNumber,
      carModel,
      driverLicense,
      isVerified
    });
    
    // Create a sanitized version of the driver object (remove password)
    const driverResponse = {
      _id: newDriver._id,
      name: newDriver.name,
      email: newDriver.email,
      carNumber: newDriver.carNumber,
      carModel: newDriver.carModel,
      driverLicense: newDriver.driverLicense,
      isVerified: newDriver.isVerified
    };
    
    return res.status(201).json({
      success: true,
      message: "Driver registered successfully",
      driver: driverResponse
    });
    
  } catch (error) {
    console.error("Signup error:", error);
    
    // Provide specific error message for duplicate key error (typically email)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already in use"
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors
      });
    }
    
    // Generic error response
    return res.status(500).json({
      success: false,
      message: "Server error during signup",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const handleDriverLogin = async (req, res) => {
  try {
    // Check if required fields are provided
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find driver by email
    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found. Please check your email or sign up"
      });
    }

    // Check if driver is verified
    if (!driver.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Account not verified. Please wait for license verification or contact support"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    // Generate tokens
    try {
      const accessToken = generateAcessToken(driver);
      const refreshToken = generateRefreshToken(driver);
      
      // Update driver's refresh token
      driver.refreshToken = refreshToken;
      await driver.save();

      // Send response with tokens
      return res.status(200).json({
        success: true,
        message: "Login successful",
        driver: {
          _id: driver._id,
          name: driver.name,
          email: driver.email,
          isVerified: driver.isVerified
        },
        accessToken,
        refreshToken
      });
    } catch (tokenError) {
      console.error("Token generation error:", tokenError);
      return res.status(500).json({
        success: false,
        message: "Error generating authentication tokens"
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    
    // Handle specific errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid input format"
      });
    }
    
    // Generic error response
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};






export {handleDriverLogin,handleDriverSignUp};
