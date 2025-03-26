import React, { useState } from 'react';
import { Calendar, MapPin, Phone, Mail, Star, Clock, Car, User, Shield, CreditCard, ThumbsUp, MessageCircle } from 'lucide-react';

const CustomerProfile = () => {
  const customer = { 
    name: "Taylor Smith",
    avatar: "/customer.png",
    rating: 4.9,
    totalRides: 87,
    location: "Oakland, CA",
    email: "taylor.s@example.com",
    phone: "(555) 987-6543",
    memberSince: "March 2023",
    verified: true,
    paymentMethods: [
      { id: 1, type: "Credit Card", last4: "4567", default: true },
      { id: 2, type: "PayPal", email: "taylor@example.com", default: false }
    ],
    upcomingRides: [
      { id: 1, date: "Mar 17, 2025", from: "Oakland", to: "San Francisco", time: "9:15 AM", driver: "Chris M." },
      { id: 3, date: "Mar 22, 2025", from: "San Jose", to: "Oakland", time: "6:00 PM", driver: "Pat D." }
    ],
    rideHistory: [
      { id: 101, date: "Mar 14, 2025", from: "Oakland", to: "Berkeley", time: "10:30 AM", cost: "$12.75" },
      { id: 102, date: "Mar 9, 2025", from: "San Francisco", to: "Oakland", time: "5:45 PM", cost: "$16.50" }
    ],
    savedLocations: [
      { id: 1, name: "Home", address: "123 Oak St, Oakland, CA" },
      { id: 2, name: "Work", address: "456 Market St, San Francisco, CA" },
      { id: 3, name: "Gym", address: "789 Fitness Ave, Oakland, CA" }
    ],
    reviews: [
      { id: 1, driver: "Alex J.", rating: 5, comment: "Great passenger, on time and friendly!", date: "Mar 14, 2025" },
      { id: 2, driver: "Robin P.", rating: 5, comment: "Always a pleasure to drive with Taylor!", date: "Mar 5, 2025" }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-blue-500 p-6 flex items-center space-x-4">
              <img 
                src={customer.avatar} 
                alt={customer.name} 
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <div className="text-white">
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold">{customer.name}</h2>
                  {customer.verified && (
                    <Shield className="w-5 h-5 text-green-300 ml-2" />
                  )}
                </div>
                <div className="flex items-center mt-1">
                  <Star className="w-5 h-5 text-yellow-300 fill-current" />
                  <span className="ml-1">{customer.rating} • {customer.totalRides} rides</span>
                </div>
                <div className="flex items-center mt-1">
                  <MapPin className="w-4 h-4" />
                  <span className="ml-1">{customer.location}</span>
                </div>
                <div className="text-sm mt-1">Member since {customer.memberSince}</div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-3">Payment Methods</h3>
              {customer.paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center p-3 bg-gray-50 rounded-md mb-2">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <div className="ml-3 flex-grow">
                    <div className="font-medium">{method.type} •••• {method.last4 || method.email}</div>
                    {method.default && <span className="text-sm text-blue-500">Default</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Saved Locations */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-3">Saved Locations</h3>
              {customer.savedLocations.map((location) => (
                <div key={location.id} className="p-3 bg-gray-50 rounded-md mb-2">
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-gray-600">{location.address}</div>
                </div>
              ))}
            </div>

            {/* Reviews */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-3">Recent Reviews</h3>
              {customer.reviews.map((review) => (
                <div key={review.id} className="border-l-4 border-green-400 pl-4 py-1 mb-2">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{review.driver}</span>
                    <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700 mt-1">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
  )
};

export default CustomerProfile;