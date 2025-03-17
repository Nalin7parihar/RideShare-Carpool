import React, { useState } from 'react';
import {  Car, User,  } from 'lucide-react';
import CustomerProfile from '../components/CustomerProfile';
import DriverProfile from '../components/DriverProfile';

const CarpoolProfiles = () => {
  const [activeTab, setActiveTab] = useState('driver');
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
     
      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto flex">
          <button 
            className={`px-6 py-4 font-medium ${activeTab === 'driver' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('driver')}
          >
            <div className="flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Driver Profile
            </div>
          </button>
          <button 
            className={`px-6 py-4 font-medium ${activeTab === 'customer' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('customer')}
          >
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer Profile
            </div>
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto p-4 flex-grow">
        {activeTab === 'driver' ? (
          <DriverProfile/>
        ) : (
          <CustomerProfile/>
        )}
      </main>
    </div>
  );
};

export default CarpoolProfiles;
