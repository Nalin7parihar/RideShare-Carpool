import { useState } from "react";
import { Link } from "react-router-dom";
import AboutUsPopup from "./AboutUs";
const Navbar = ({ login }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {setIsOpen(false)};
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              ></path>
            </svg>
            <span className="font-bold text-xl">RideShare</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="py-1 border-b-2 border-transparent hover:border-white">
              Home
            </Link>
            <Link to="/my-rides" className="py-1 border-b-2 border-transparent hover:border-white">
              My Rides
            </Link>
            <Link to="/bookRide" className="py-1 border-b-2 hover:border-white border-transparent text-lg font-bold">
             Book a Ride
            </Link>

            <Link to="/payments" className="py-1 border-b-2 border-transparent hover:border-white">
              Payments
            </Link>
            <button onClick={() => setIsOpen(true)} className="py-1 border-b-2 border-transparent hover:border-white">
            About Us
            </button>

            {isOpen && <AboutUsPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />}
          </div>

          {/* User & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-1">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
              <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile / Login Button */}
            {login ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-semibold">
                  JD
                </div>
                <span className="hidden md:inline">John Doe</span>
              </div>
            ) : (
              <Link to="/Auth">
                <button className="bg-white text-blue-600 px-4 py-1 rounded-full font-medium">
                  Login
                </button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-3 space-y-2 text-center bg-blue-700 p-3 rounded-lg">
            <Link to="/" className="block py-2 hover:bg-blue-800 rounded-md">Home</Link>
            <Link to="/my-rides" className="block py-2 hover:bg-blue-800 rounded-md">My Rides</Link>
            <Link to="/messages" className="block py-2 hover:bg-blue-800 rounded-md">Messages</Link>
            <Link to="/payments" className="block py-2 hover:bg-blue-800 rounded-md">Payments</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
