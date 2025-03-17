import React from 'react'
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-6">
    <div className="container mx-auto px-4">
      {/* Top section - stacks on small screens, side by side on medium+ */}
      <div className="flex flex-col md:flex-row justify-between items-start">
        {/* Company info - full width on mobile, normal on larger */}
        <div className="w-full md:w-auto mb-8 md:mb-0">
          <h2 className="text-xl font-bold">RideShare</h2>
          <p className="text-sm text-blue-100 mt-1 max-w-xs">Making commutes easier, greener, and more affordable for everyone</p>
          <div className="mt-4 flex items-center space-x-3">
            <a href="#" className="bg-white text-blue-600 px-3 py-1 text-sm rounded hover:bg-blue-100 transition duration-300">
              Download App
            </a>
          </div>
        </div>
        
        {/* Links section - grid layout for better responsiveness */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-8 gap-y-6 w-full md:w-auto">
          <div>
            <h3 className="font-medium mb-3 text-white">Quick Links</h3>
            <ul className="text-sm text-blue-100 space-y-2">
              <li><a href="#" className="hover:text-white transition duration-200">Find a Ride</a></li>
              <li><a href="#" className="hover:text-white transition duration-200">Offer a Ride</a></li>
              <li><a href="#" className="hover:text-white transition duration-200">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition duration-200">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 text-white">Support</h3>
            <ul className="text-sm text-blue-100 space-y-2">
              <li><a href="#" className="hover:text-white transition duration-200">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition duration-200">Safety</a></li>
              <li><a href="#" className="hover:text-white transition duration-200">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition duration-200">Help Center</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom section with copyright and social icons */}
      <div className="mt-8 pt-6 border-t border-blue-500 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-blue-100 mb-4 sm:mb-0 text-center sm:text-left">
          © 2025 CarPool Connect. All rights reserved.
        </p>
        <div className="flex space-x-6 items-center">
          <a href="#" className="text-blue-100 hover:text-white transition duration-200">
            <span className="sr-only">Facebook</span>
            <FaFacebook />
          </a>
          <a href="#" className="text-blue-100 hover:text-white transition duration-200">
            <span className="sr-only">Twitter</span>
            <FaXTwitter />
          </a>
          <a href="#" className="text-blue-100 hover:text-white transition duration-200">
            <span className="sr-only">Instagram</span>
            <FaInstagram />
          </a>
          <a href="#" className="text-sm text-blue-100 hover:text-white transition duration-200">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-blue-100 hover:text-white transition duration-200">
            Terms
          </a>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer