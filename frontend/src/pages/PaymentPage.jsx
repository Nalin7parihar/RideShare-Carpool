import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown, DollarSign, Calendar, User, Car, Filter } from 'lucide-react';

const PaymentsPage = () => {
  // Sample data for payments
  const [payments, setPayments] = useState([
    { id: 1, date: '2025-03-10', amount: 15.50, status: 'Paid', type: 'Sent', user: 'Alex Smith', trip: 'Downtown to Airport' },
    { id: 2, date: '2025-03-08', amount: 12.75, status: 'Pending', type: 'Received', user: 'Jamie Wong', trip: 'Midtown to Suburbs' },
    { id: 3, date: '2025-03-05', amount: 22.00, status: 'Paid', type: 'Sent', user: 'Taylor Reed', trip: 'Campus to Downtown' },
    { id: 4, date: '2025-03-01', amount: 18.25, status: 'Paid', type: 'Received', user: 'Jordan Lee', trip: 'Airport to Home' },
    { id: 5, date: '2025-02-28', amount: 9.50, status: 'Failed', type: 'Sent', user: 'Casey Jones', trip: 'Home to Office' },
  ]);

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter options
  const filterOptions = ['All', 'Sent', 'Received', 'Paid', 'Pending', 'Failed'];

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Filter and sort payments
  const filteredPayments = payments.filter(payment => 
    selectedFilter === 'All' || 
    payment.status === selectedFilter || 
    payment.type === selectedFilter
  ).sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Page Title */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Payment History</h2>
            
          </div>

          {/* Filter Bar */}
          <div className="bg-blue-50 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-blue-600" />
              <span className="text-gray-700">Filter:</span>
              <div className="relative">
                <select 
                  className="bg-white border border-blue-200 rounded-md py-1 px-3 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  {filterOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            
          </div>

          {/* Payments Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Date</span>
                      {sortBy === 'date' && <ArrowUpDown size={14} className="text-blue-600" />}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} />
                      <span>Amount</span>
                      {sortBy === 'amount' && <ArrowUpDown size={14} className="text-blue-600" />}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>User</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Car size={14} />
                      <span>Trip</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`${payment.type === 'Received' ? 'text-green-600' : 'text-red-600'}`}>
                        {payment.type === 'Received' ? '+' : '-'}${payment.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.trip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={`py-1 px-2 rounded-full text-xs ${
                        payment.type === 'Sent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {payment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`py-1 px-2 rounded-full text-xs ${
                        payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No payments message */}
          {filteredPayments.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No payments found matching your filter.
            </div>
          )}

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of{" "}
                <span className="font-medium">{filteredPayments.length}</span> results
              </p>
              <div className="flex gap-2">
                <button className="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentsPage;