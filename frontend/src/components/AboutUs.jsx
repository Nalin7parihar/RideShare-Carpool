import React, { useState } from 'react';

const AboutUsPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-blue-600">About RideShare Connect</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4">
          {/* Mission */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h3>
            <p className="text-gray-600">
              At RideShare Connect, we're committed to transforming urban mobility through 
              community-powered carpooling. Our platform connects drivers with empty seats 
              to passengers heading the same way, reducing traffic congestion and carbon 
              emissions while building community connections.
            </p>
          </div>
          
          {/* How It Works */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="bg-blue-100 w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-1">Search a Ride</h4>
                <p className="text-sm text-gray-600">Enter your start and end locations, preferred date, and find available rides that match your route.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="bg-blue-100 w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">2</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-1">Book & Pay</h4>
                <p className="text-sm text-gray-600">Select the ride that suits you best, book your seat securely, and pay through our secure payment system.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="bg-blue-100 w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">3</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-1">Enjoy the Ride</h4>
                <p className="text-sm text-gray-600">Meet at the agreed location, travel together, and leave a review after your journey is complete.</p>
              </div>
            </div>
          </div>
          
          {/* Our Story */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Story</h3>
            <p className="text-gray-600 mb-3">
              Founded in 2023 by a group of urban commuters frustrated with traffic congestion, 
              RideShare Connect began as a local community initiative to make daily commutes more 
              efficient and enjoyable.
            </p>
            <p className="text-gray-600 mb-3">
              What started as a simple ride-sharing board quickly evolved into a comprehensive 
              platform connecting thousands of drivers and passengers daily. Today, we're proud 
              to serve communities across 12 major cities, with plans to expand nationwide.
            </p>
          </div>
          
          {/* Stats */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-blue-600 text-2xl font-bold">50,000+</p>
                <p className="text-gray-600 text-sm">Active Users</p>
              </div>
              <div>
                <p className="text-blue-600 text-2xl font-bold">12</p>
                <p className="text-gray-600 text-sm">Cities Served</p>
              </div>
              <div>
                <p className="text-blue-600 text-2xl font-bold">1.2M</p>
                <p className="text-gray-600 text-sm">Rides Completed</p>
              </div>
            </div>
          </div>
          
          {/* Values */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Values</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Sustainability</h4>
                  <p className="text-sm text-gray-600">Reducing carbon emissions through shared transportation</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Community</h4>
                  <p className="text-sm text-gray-600">Building connections between neighbors and commuters</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Safety</h4>
                  <p className="text-sm text-gray-600">Prioritizing user security through thorough verification processes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Have questions or feedback?</p>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => console.log('Contact Us clicked')}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPopup;