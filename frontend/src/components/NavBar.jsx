import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AboutUsPopup from "./AboutUs";
import { logoutUser } from "../Store/userSlice";
import { logoutDriver } from "../Store/driverSlice";
const Navbar = ({ scrollToForm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user); // Passenger
  const driver = useSelector((state) => state.driver.driver); // Driver
  
  const handeLogout = () =>{
    if(user){
      console.log(user);
      dispatch(logoutUser());
    }else{
      console.log(driver);
      dispatch(logoutDriver());
    }
  }
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
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
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl"> RideShare</span>
        </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link to= {user ? "/" : "/driver-dashboard"} className="hover:text-gray-300">Home</Link>

          {/* Conditional Links for Users & Drivers */}
          {user && <p onClick={scrollToForm} className="cursor-pointer hover:text-gray-300">Book a Ride</p>}
          

          <Link to={user ? "/user-rides" : "/my-rides"} className="hover:text-gray-300">My Rides</Link>
          <Link to="/payments" className="hover:text-gray-300">Payments</Link>
          <button onClick={() => setIsOpen(true)} className="hover:text-gray-300">About Us</button>
        </div>

        {/* Profile & Login/Logout */}
        <div className="flex items-center space-x-4">
          {user || driver ? (
            <div className="flex items-center space-x-2">
              <Link to = {user ? "/CustomerProfile" : "/DriverProfile"} className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-semibold"> 
                {user?.user?.name[0] || driver?.driver?.name[0] || "U"}
              </Link>
              <span className="hidden md:inline">{user?.user?.name || driver?.driver?.name || "User"}</span>
              <button onClick={handeLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-700">Logout</button>
            </div>
          ) : (
            <Link to="/Auth">
              <button className="bg-white text-blue-600 px-4 py-1 rounded-full font-medium">Login</button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 text-center p-3 rounded-lg">
          <Link to="/" className="block py-2 hover:bg-blue-800 rounded-md">Home</Link>
          {user && <p onClick={scrollToForm} className="block py-2 cursor-pointer hover:bg-blue-800 rounded-md">Book a Ride</p>}
          {driver && <Link to="/driver/offer-ride" className="block py-2 hover:bg-blue-800 rounded-md">Offer a Ride</Link>}
          <Link to="/my-rides" className="block py-2 hover:bg-blue-800 rounded-md">My Rides</Link>
          <Link to="/payments" className="block py-2 hover:bg-blue-800 rounded-md">Payments</Link>
        </div>
      )}

      {/* About Us Popup */}
      {isOpen && <AboutUsPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </nav>
  );
};

export default Navbar;
