import React from 'react'
import { Calendar, MapPin, Phone, Mail, Star, Clock, Car, Shield} from 'lucide-react';
const DriverProfile = () => {
  const driver = {
    name: "Alex Johnson",
    avatar: "/driver.png",
    rating: 4.8,
    totalRides: 142,
    location: "San Francisco, CA",
    email: "alex.j@example.com",
    phone: "(555) 123-4567",
    memberSince: "January 2023",
    verified: true,
    carInfo: {
      make: "Toyota",
      model: "Prius",
      year: 2022,
      color: "Blue",
      licensePlate: "ECO-1234",
      seats: 4
    },
    upcomingRides: [
      { id: 1, date: "Mar 18, 2025", from: "Downtown SF", to: "Oakland", time: "8:00 AM", passengers: 2 },
      { id: 2, date: "Mar 20, 2025", from: "Oakland", to: "San Jose", time: "5:30 PM", passengers: 3 }
    ],
    rideHistory: [
      { id: 101, date: "Mar 12, 2025", from: "SF Airport", to: "Downtown SF", time: "2:00 PM", earnings: "$18.50" },
      { id: 102, date: "Mar 10, 2025", from: "Berkeley", to: "San Mateo", time: "7:15 AM", earnings: "$24.75" }
    ],
    earnings: {
      total: "$2,845.50",
      thisMonth: "$342.25"
    },
    reviews: [
      { id: 1, user: "Jamie L.", rating: 5, comment: "Very punctual and friendly driver!", date: "Mar 12, 2025" },
      { id: 2, user: "Sam T.", rating: 5, comment: "Clean car and great conversation!", date: "Mar 8, 2025" }
    ]
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-500 p-6 flex items-center space-x-4">
              <img 
                src={driver.avatar} 
                alt={driver.name} 
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <div className="text-white">
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold">{driver.name}</h2>
                  {driver.verified && (
                    <Shield className="w-5 h-5 text-green-300 ml-2" />
                  )}
                </div>
                <div className="flex items-center mt-1">
                  <Star className="w-5 h-5 text-yellow-300 fill-current" />
                  <span className="ml-1">{driver.rating} • {driver.totalRides} rides</span>
                </div>
                <div className="flex items-center mt-1">
                  <MapPin className="w-4 h-4" />
                  <span className="ml-1">{driver.location}</span>
                </div>
                <div className="text-sm mt-1">Member since {driver.memberSince}</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="ml-2">{driver.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="ml-2">{driver.email}</span>
                </div>
              </div>
            </div>

            {/* Car Information */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-3">Car Information</h3>
              <div className="flex items-center mb-3">
                <Car className="w-5 h-5 text-gray-500" />
                <span className="ml-2 font-medium">{driver.carInfo.year} {driver.carInfo.make} {driver.carInfo.model}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Color:</span> {driver.carInfo.color}
                </div>
                <div>
                  <span className="text-gray-500">License Plate:</span> {driver.carInfo.licensePlate}
                </div>
                <div>
                  <span className="text-gray-500">Seats:</span> {driver.carInfo.seats}
                </div>
              </div>
            </div>

            {/* Earnings */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-3">Earnings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="text-sm text-gray-600">Total Earnings</div>
                  <div className="text-2xl font-bold text-blue-700">{driver.earnings.total}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <div className="text-sm text-gray-600">This Month</div>
                  <div className="text-2xl font-bold text-green-700">{driver.earnings.thisMonth}</div>
                </div>
              </div>
            </div>

    
            {/* Reviews */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-3">Recent Reviews</h3>
              {driver.reviews.length > 0 ? (
                <div className="space-y-4">
                  {driver.reviews.map(review => (
                    <div key={review.id} className="border-l-4 border-green-400 pl-4 py-1">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="ml-2 font-medium">{review.user}</span>
                        <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 mt-1">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>
  )
}

export default DriverProfile