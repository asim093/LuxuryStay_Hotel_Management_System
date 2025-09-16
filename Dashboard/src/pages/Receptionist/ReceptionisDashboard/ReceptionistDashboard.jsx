import { useState, useEffect } from 'react';
import { 
  Users, 
  Key, 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Eye,
  Phone,
  MessageSquare,
  UserCheck,
  UserX,
  Bed,
  CreditCard,
  Bell,
  MapPin,
  Coffee,
  Car,
  Wifi,
  ShoppingBag,
  Star
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const ReceptionistDashboard = () => {
  const [stats, setStats] = useState({
    totalGuests: 0,
    checkInsToday: 0,
    checkOutsToday: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    // Load data from localStorage or API
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const guestRequests = JSON.parse(localStorage.getItem('guest_requests') || '[]');
    
    setStats({
      totalGuests: bookings.filter(booking => booking.status === 'Checked In').length || 156,
      checkInsToday: bookings.filter(booking => 
        booking.status === 'Confirmed' && 
        new Date(booking.checkInDate).toDateString() === new Date().toDateString()
      ).length || 28,
      checkOutsToday: bookings.filter(booking => 
        new Date(booking.checkOutDate).toDateString() === new Date().toDateString()
      ).length || 22,
      pendingRequests: guestRequests.filter(request => request.status === 'Pending').length || 15
    });
  }, []);

  const weeklyData = [
    { day: 'Mon', checkIns: 25, checkOuts: 18, occupancy: 85 },
    { day: 'Tue', checkIns: 32, checkOuts: 22, occupancy: 88 },
    { day: 'Wed', checkIns: 28, checkOuts: 25, occupancy: 82 },
    { day: 'Thu', checkIns: 35, checkOuts: 20, occupancy: 90 },
    { day: 'Fri', checkIns: 42, checkOuts: 15, occupancy: 95 },
    { day: 'Sat', checkIns: 45, checkOuts: 12, occupancy: 98 },
    { day: 'Sun', checkIns: 30, checkOuts: 28, occupancy: 85 }
  ];

  const serviceRequestData = [
    { name: 'Room Service', value: 35, color: '#3b82f6' },
    { name: 'Housekeeping', value: 25, color: '#10b981' },
    { name: 'Concierge', value: 20, color: '#f59e0b' },
    { name: 'Maintenance', value: 15, color: '#ef4444' },
    { name: 'Other', value: 5, color: '#6b7280' }
  ];

  const recentCheckIns = [
    { id: 1, guest: 'John Smith', room: '205', time: '10:30 AM', type: 'Standard', duration: '3 nights', vip: false },
    { id: 2, guest: 'Maria Garcia', room: '312', time: '11:15 AM', type: 'Deluxe', duration: '2 nights', vip: true },
    { id: 3, guest: 'David Johnson', room: '108', time: '12:45 PM', type: 'Suite', duration: '5 nights', vip: false },
    { id: 4, guest: 'Lisa Chen', room: '401', time: '1:20 PM', type: 'Standard', duration: '1 night', vip: false },
    { id: 5, guest: 'Robert Wilson', room: '156', time: '2:10 PM', type: 'Deluxe', duration: '4 nights', vip: true }
  ];

  const upcomingCheckOuts = [
    { id: 1, guest: 'Sarah Thompson', room: '203', time: '11:00 AM', payment: 'Settled', luggage: true },
    { id: 2, guest: 'Mike Rodriguez', room: '115', time: '12:00 PM', payment: 'Pending', luggage: false },
    { id: 3, guest: 'Emily Davis', room: '309', time: '10:30 AM', payment: 'Settled', luggage: true },
    { id: 4, guest: 'James Brown', room: '278', time: '2:00 PM', payment: 'Settled', luggage: false }
  ];

  const guestRequests = [
    { id: 1, guest: 'John Smith', room: '205', request: 'Extra towels and pillows', time: '15 mins ago', priority: 'Low', type: 'housekeeping' },
    { id: 2, guest: 'Maria Garcia', room: '312', request: 'Restaurant recommendation', time: '30 mins ago', priority: 'Medium', type: 'concierge' },
    { id: 3, guest: 'David Johnson', room: '108', request: 'Late checkout request', time: '45 mins ago', priority: 'High', type: 'admin' },
    { id: 4, guest: 'Lisa Chen', room: '401', request: 'Room service - dinner', time: '1 hour ago', priority: 'Medium', type: 'service' }
  ];

  const getRequestIcon = (type) => {
    switch (type) {
      case 'housekeeping': return <Bed size={16} className="text-blue-500" />;
      case 'concierge': return <MapPin size={16} className="text-green-500" />;
      case 'service': return <Coffee size={16} className="text-orange-500" />;
      case 'admin': return <Calendar size={16} className="text-purple-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRoomTypeColor = (type) => {
    switch (type) {
      case 'Suite': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Deluxe': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Standard': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reception Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage guest services, check-ins, check-outs, and hotel operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Guests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalGuests}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">+5.2%</span>
            <span className="text-sm text-gray-500 ml-1">from last week</span>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Check-ins Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.checkInsToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <UserCheck size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">+12.8%</span>
            <span className="text-sm text-gray-500 ml-1">from yesterday</span>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Check-outs Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.checkOutsToday}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <UserX size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingDown size={16} className="text-red-500" />
            <span className="text-sm font-medium text-red-600 ml-1">-2.1%</span>
            <span className="text-sm text-gray-500 ml-1">from yesterday</span>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingRequests}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Bell size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <Bell size={16} className="text-yellow-500" />
            <span className="text-sm font-medium text-yellow-600 ml-1">Active</span>
            <span className="text-sm text-gray-500 ml-1">requests waiting</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="checkIns" fill="#10b981" name="Check-ins" />
              <Bar dataKey="checkOuts" fill="#f59e0b" name="Check-outs" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Trend */}
        <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Occupancy Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={3} name="Occupancy %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Guest Requests */}
        <div className="lg:col-span-2">
          <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Guest Requests</h2>
              <button className="btn btn-primary btn-sm">
                <Plus size={16} className="mr-2" />
                New Request
              </button>
            </div>
            <div className="space-y-4">
              {guestRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getRequestIcon(request.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{request.guest} - Room {request.room}</h3>
                      <p className="text-sm text-gray-600">{request.request}</p>
                      <p className="text-xs text-gray-500">{request.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Handle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Requests Distribution */}
        <div className="lg:col-span-1">
          <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Request Types</h2>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={serviceRequestData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceRequestData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Check-ins and Check-outs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Check-ins */}
        <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Check-ins</h2>
            <button className="btn btn-outline btn-sm">
              <Eye size={16} className="mr-2" />
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentCheckIns.map((guest) => (
              <div key={guest.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <UserCheck size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 text-sm">{guest.guest}</h3>
                      {guest.vip && (
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Room {guest.room} • {guest.duration}</p>
                    <p className="text-xs text-gray-500">{guest.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoomTypeColor(guest.type)}`}>
                  {guest.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Check-outs */}
        <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Check-outs</h2>
            <button className="btn btn-outline btn-sm">
              <Eye size={16} className="mr-2" />
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingCheckOuts.map((guest) => (
              <div key={guest.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <UserX size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{guest.guest}</h3>
                    <p className="text-sm text-gray-600">Room {guest.room} • {guest.time}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${guest.payment === 'Settled' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {guest.payment}
                      </span>
                      {guest.luggage && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                          Luggage Ready
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Guest Management</h3>
              <p className="text-blue-100 text-sm mt-1">Check-ins, check-outs & profiles</p>
            </div>
            <Users size={32} className="text-blue-200" />
          </div>
          <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
            Manage Guests
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Room Status</h3>
              <p className="text-green-100 text-sm mt-1">Availability & housekeeping</p>
            </div>
            <Bed size={32} className="text-green-200" />
          </div>
          <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
            View Rooms
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Concierge Services</h3>
              <p className="text-purple-100 text-sm mt-1">Guest requests & assistance</p>
            </div>
            <Bell size={32} className="text-purple-200" />
          </div>
          <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
            View Services
          </button>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Billing & Payments</h3>
              <p className="text-orange-100 text-sm mt-1">Process payments & invoices</p>
            </div>
            <CreditCard size={32} className="text-orange-200" />
          </div>
          <button className="mt-4 bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors">
            View Billing
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;