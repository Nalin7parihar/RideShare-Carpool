import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { toast } from 'react-toastify';
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
      const result = await createUserWithEmailAndPassword(auth, email, password);

  
      if (displayName) {
        await updateProfile(result.user, { displayName });

      }
      toast.success(' Successfully Registered!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
  
      return result.user;
    } catch (error) {
      const errorMessage = _formatAuthError(error);
      toast.error('Login failed. Please check your credentials.');
      throw new Error(errorMessage);
    }
  },
  

  signInwithEmail: async (email, password) => {
    console.log("⏳ Starting Firebase Sign-in Process...");
    _validateEmailPassword(email, password);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful! Welcome back!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });

      return result.user;
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      const errorMessage = _formatAuthError(error);
      throw new Error(errorMessage);
    }
  },

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

const _validateEmailPassword = (email, password) => {
  if (!email || !email.trim() || !_isValidEmail(email)) {
    throw new Error("Please provide a valid email address");
  }
  
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
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

const _isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default AuthService;