// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCpO10HQzSialXNoVhSeVqGFK30ar1O4wU",
  authDomain: "rideshare-76394.firebaseapp.com",
  projectId: "rideshare-76394",
  storageBucket: "rideshare-76394.firebasestorage.app",
  messagingSenderId: "431164031640",
  appId: "1:431164031640:web:bd11e89b3f57b8082fc6ed",
  measurementId: "G-KGCZ97SZF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app,auth};