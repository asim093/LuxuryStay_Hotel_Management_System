import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import { toast } from 'react-toastify';

const ReceptionistDashboard = () => {
  const token = useSelector((state) => state.user?.data?.user?.token || state.user?.token);
  
  // Debug token
  useEffect(() => {
    console.log('Token in Receptionist Dashboard:', token ? 'Present' : 'Missing');
  }, [token]);
  const [stats, setStats] = useState({
    totalGuests: 0,
    checkInsToday: 0,
    checkOutsToday: 0,
    pendingRequests: 0
  });
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [upcomingCheckOuts, setUpcomingCheckOuts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReceptionistData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all bookings
      const bookingsResponse = await fetch('http://localhost:3001/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        const bookings = bookingsData.bookings || [];
        
        console.log('Fetched bookings:', bookings.length);
        console.log('Sample booking data:', bookings[0]);

        // Calculate stats
        const checkedInGuests = bookings.filter(booking => booking.status === 'Checked In');
        
        // Today's check-ins (bookings that were checked in today)
        const todayCheckIns = bookings.filter(booking => 
          booking.status === 'Checked In' && 
          booking.actualCheckInTime &&
          new Date(booking.actualCheckInTime).toDateString() === new Date().toDateString()
        );
        
        // Today's check-outs (bookings that were checked out today)
        const todayCheckOuts = bookings.filter(booking => 
          booking.status === 'Checked Out' && 
          (booking.actualCheckOutTime ? 
            new Date(booking.actualCheckOutTime).toDateString() === new Date().toDateString() :
            new Date(booking.updatedAt).toDateString() === new Date().toDateString()
          )
        );

        console.log('Stats calculated:', {
          checkedInGuests: checkedInGuests.length,
          todayCheckIns: todayCheckIns.length,
          todayCheckOuts: todayCheckOuts.length
        });

        setStats({
          totalGuests: checkedInGuests.length,
          checkInsToday: todayCheckIns.length,
          checkOutsToday: todayCheckOuts.length,
          pendingRequests: bookings.filter(booking => booking.status === 'Pending').length
        });

        // Set recent check-ins (last 5)
        const recentCheckInsData = checkedInGuests.slice(0, 5).map(booking => ({
          id: booking._id,
          guest: booking.guest?.name || 'Unknown Guest',
          room: booking.room?.roomNumber || 'N/A',
          time: new Date(booking.actualCheckInTime || booking.createdAt).toLocaleTimeString(),
          type: booking.room?.roomType || 'Standard',
          duration: calculateNights(booking.checkInDate, booking.checkOutDate) + ' nights',
          vip: booking.isVip || false
        }));
        
        setRecentCheckIns(recentCheckInsData);

        // Set recent check-outs (today's check-outs)
        const upcomingCheckOutsData = todayCheckOuts.map(booking => ({
          id: booking._id,
          guest: booking.guest?.name || 'Unknown Guest',
          room: booking.room?.roomNumber || 'N/A',
          time: booking.actualCheckOutTime ? 
            new Date(booking.actualCheckOutTime).toLocaleTimeString() :
            new Date(booking.updatedAt).toLocaleTimeString(),
          payment: booking.paymentStatus || 'Pending',
          luggage: booking.luggageStored || false
        }));
        
        setUpcomingCheckOuts(upcomingCheckOutsData);
        
        console.log('Recent check-ins:', recentCheckInsData);
        console.log('Upcoming check-outs:', upcomingCheckOutsData);
      } else {
        const errorData = await bookingsResponse.json();
        console.error('Failed to fetch receptionist data:', errorData);
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching receptionist data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    fetchReceptionistData();
  }, [token]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      console.log('Auto-refreshing Receptionist Dashboard data...');
      fetchReceptionistData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [token]);

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

  // Dummy data removed - now using real data from API

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reception Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage guest services, check-ins, check-outs, and hotel operations</p>
        </div>
        <button
          onClick={fetchReceptionistData}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
              Loading...
            </>
          ) : (
            <>
              <Eye size={16} className="mr-2" />
              Refresh Data
            </>
          )}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Guests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : stats.totalGuests}</p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : stats.checkInsToday}</p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : stats.checkOutsToday}</p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : stats.pendingRequests}</p>
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
            {recentCheckIns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserCheck size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No recent check-ins found</p>
              </div>
            ) : (
              recentCheckIns.map((guest) => (
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
              ))
            )}
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
            {upcomingCheckOuts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserX size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No upcoming check-outs today</p>
              </div>
            ) : (
              upcomingCheckOuts.map((guest) => (
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
              ))
            )}
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