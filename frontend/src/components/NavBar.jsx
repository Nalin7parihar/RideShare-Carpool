import { useState } from "react";
import { Link } from "react-router-dom";
import AboutUsPopup from "./AboutUs";
const Navbar = ({ login,scrollToForm }) => {
  const [isOpen, setIsOpen] = useState(false);

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
            <p onClick = {scrollToForm} className="py-1 border-b-2 hover:border-white border-transparent text-lg font-bold">
             Book a Ride
            </p>

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
