import { auth } from './firebase';
import { GoogleAuthProvider,signInWithPopup,signOut} from "firebase/auth";
import { toast } from 'react-toastify';
import axios from 'axios';
const googleAuth = new GoogleAuthProvider();

const AuthService = {
  signInwithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleAuth);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      toast.success('Login successful! Welcome !', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      }); 
      return {
        user: result.user,
        token: token
      }
    } catch (error) {
      const errorMessage = _formatAuthError(error);
      toast.error('Login failed. Please check your credentials.');
      throw new Error(errorMessage);
    }
  },

  signUpwithEmail: async (email, password, displayName = "") => {
    try {
      // Call your backend API endpoint for registration using axios
      const response = await axios.post('http://localhost:8080/api/users/', {
        email, 
        password, 
        name : displayName
      });
      
      // The response.data is already the user object based on your API
      const user = response.data;
      
      toast.success('Successfully Registered!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      return user; // Return the user data directly
    } catch (error) {
      // Axios error handling
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error('Registration failed. Please try again.');
      throw new Error(errorMessage);
    }
  },
  
  signInwithEmail: async (email, password) => {
    console.log("⏳ Starting Sign-in Process...");
    
    try {
      // Call your backend API endpoint for login using axios
      const response = await axios.post('http://localhost:8080/api/users/login', {
        email,
        password
      });
      
      // The response.data is already the user object
      const user = response.data;
      
      toast.success('Login successful! Welcome back!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      return user; // Return the user data directly
    } catch (error) {
      // Better error handling with axios
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error('Login failed. Please check your credentials.');
      throw new Error(errorMessage);
    }
  },
  signUpDriverWithEmail : async (formData) =>{
    try {
      const response = await axios.post('http://localhost:8080/api/driver/', formData);
      console.log('Driver registered:', response.data);
      const driver = response.data;
      toast.success('Successfully Registered!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return driver;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error('Registration failed. Please try again.');
      throw new Error(errorMessage);
    }
  },
  driverSignInwithEmail : async (email,password) =>{
    try {
      const response = await axios.post('http://localhost:8080/api/driver/login', {
        email,
        password
      });
      const driver = response.data;
      toast.success('Login successful! Welcome back!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return driver;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error('Login failed. Please check your credentials.');
      throw new Error(errorMessage);
  }},
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      const errorMessage = _formatAuthError(error);
      throw new Error(errorMessage);
    }
  },
  getCurrentUser: () => auth.currentUser,
};



const _formatAuthError = (error) => {
  const errorCode = error.code;
  
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return "This email is already registered. Please use a different email or sign in.";
    case 'auth/invalid-email':
      return "Please provide a valid email address.";
    case 'auth/user-disabled':
      return "This account has been disabled. Please contact support.";
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return "Invalid email or password. Please try again.";
    case 'auth/too-many-requests':
      return "Too many failed login attempts. Please try again later or reset your password.";
    case 'auth/popup-closed-by-user':
      return "Sign in was canceled. The popup was closed before completing authentication.";
    case 'auth/cancelled-popup-request':
      return "The authentication request was cancelled.";
    case 'auth/popup-blocked':
      return "The authentication popup was blocked by the browser. Please allow popups for this website.";
    default:
      return error.message || "An error occurred during authentication. Please try again.";
  }
};


export default AuthService;