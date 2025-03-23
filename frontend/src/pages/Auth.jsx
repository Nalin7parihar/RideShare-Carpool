import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../Store/userSlice';
import { driverSignInWithEmail,signUpDriverWithEmail } from '../Store/driverSlice';
const Auth = () => {
  const {loading} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [userType, setUserType] = useState('customer');
  const [authMode, setAuthMode] = useState('login');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    carNumber: '',
    carModel: '',
    driverLicense: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      driverLicense: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match for signup
    if(authMode === 'signup' && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    // Customer authentication
    if(userType === 'customer') {
      if(authMode === 'login') {
        dispatch(signInWithEmail({
          email: formData.email,
          password: formData.password
        }));
      } else {
        dispatch(signUpWithEmail({ 
          email: formData.email, 
          password: formData.password, 
          fullname: formData.name 
        }));
      }
    } 
    // Driver authentication
    else if(userType === 'driver') {
      if(authMode === 'login') {
        // You'll need to implement this action in your slice
        dispatch(driverSignInWithEmail({
          email: formData.email,
          password: formData.password
        }));
      } else {
        // For driver signup with license
        if (!formData.driverLicense) {
          alert("Driver license is required");
          return;
        }
        
        try {
          // Create FormData for the entire form including the file
          const driverFormData = new FormData();
          driverFormData.append('email', formData.email);
          driverFormData.append('password', formData.password);
          driverFormData.append('name', formData.name);
          driverFormData.append('carNumber', formData.carNumber);
          driverFormData.append('carModel', formData.carModel);
          driverFormData.append('driverLicense', formData.driverLicense);
          
          for (let pair of driverFormData.entries()) {
            console.log(pair[0], pair[1]);  // ✅ Logs key-value pairs properly
          }
                    // You'll need to implement this action in your slice
          dispatch(signUpDriverWithEmail(driverFormData))
            .unwrap()
            .then(() => {
              // Handle successful signup
              console.log("Driver signup successful");
            })
            .catch(error => {
              console.error("Error during driver signup:", error);
              alert("Failed to complete driver registration");
            });
        } catch (error) {
          console.error("Error during driver signup:", error);
          alert("Failed to complete driver registration");
        }
      }
    }
  };
  
  const handleGoogleAuth = () => {
    dispatch(signInWithGoogle());
  };
  
  const toggleUserType = (type) => {
    setUserType(type);
  };
  
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    // Reset form when switching modes
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      carNumber: '',
      carModel: '',
      driverLicense: null
    });
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">RideShare Connect</h1>
        
        {/* User Type Toggle */}
        <div className="flex mb-6 bg-gray-200 rounded-lg p-1">
          <button
            className={`flex-1 py-2 rounded-md ${userType === 'customer' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
            onClick={() => toggleUserType('customer')}
          >
            Passenger
          </button>
          <button
            className={`flex-1 py-2 rounded-md ${userType === 'driver' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
            onClick={() => toggleUserType('driver')}
          >
            Driver
          </button>
        </div>
        
        {/* Title based on selection */}
        <h2 className="text-xl font-semibold text-center mb-4">
          {authMode === 'login' ? 'Login' : 'Sign Up'} as a {userType === 'customer' ? 'Passenger' : 'Driver'}
        </h2>
        
        {/* Google Auth Button */}
        <button
          onClick={handleGoogleAuth}
          className="w-full mb-4 bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or continue with email</span>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
          {/* Signup-only fields */}
          {authMode === 'signup' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}
          
          {/* Common fields */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Confirm password for signup */}
          {authMode === 'signup' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          
          {/* Driver-specific fields for signup */}
          {userType === 'driver' && authMode === 'signup' && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md shadow-sm">
              <p className="text-sm text-gray-700 mb-3 font-medium">
                Driver Verification
              </p>
              
              {/* Car Number Input */}
              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1" htmlFor="carNumber">
                  Car Number
                </label>
                <input
                  type="text"
                  id="carNumber"
                  name="carNumber"
                  value={formData.carNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-300"
                  placeholder="Enter your car number"
                  required
                />
              </div>
              
              {/* Car Model */}
              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1" htmlFor="carModel">
                  Car Model
                </label>
                <input
                  type="text"
                  id="carModel"
                  name="carModel"
                  value={formData.carModel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-300"
                  placeholder="Enter your car model"
                  required
                />
              </div>

              {/* License Upload */}
              <div>
                <label className="block text-xs text-gray-600 mb-1" htmlFor="driverLicense">
                  Upload Driver's License
                </label>
                <input
                  type="file"
                  id="driverLicense"
                  name="driverLicense"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-300"
                  required
                />
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4"
            disabled={loading}
          >
            {authMode === 'login' ? (loading ? 'Logging In' : 'Login') : (loading ? 'Registering' : 'Sign Up')}
          </button>
          
          {/* Toggle between login and signup */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                {authMode === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;