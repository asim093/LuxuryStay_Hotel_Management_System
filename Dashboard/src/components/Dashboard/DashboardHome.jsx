import { useState, useEffect } from 'react';
import { 
  Users, 
  Hotel, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalStaff: 0,
    activeStaff: 0,
    totalReservations: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Load data from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    setStats({
      totalStaff: users.length,
      activeStaff: users.filter(user => user.status === 'Active').length,
      totalReservations: reservations.length,
      totalRevenue: reservations.reduce((sum, res) => sum + (res.amount || 0), 0)
    });
  }, []);

  const chartData = [
    { month: 'Jan', revenue: 45000, reservations: 120, occupancy: 85 },
    { month: 'Feb', revenue: 52000, reservations: 135, occupancy: 88 },
    { month: 'Mar', revenue: 48000, reservations: 128, occupancy: 82 },
    { month: 'Apr', revenue: 61000, reservations: 156, occupancy: 92 },
    { month: 'May', revenue: 55000, reservations: 142, occupancy: 87 },
    { month: 'Jun', revenue: 68000, reservations: 168, occupancy: 95 }
  ];

  const pieData = [
    { name: 'Confirmed', value: 65, color: '#10b981' },
    { name: 'Pending', value: 20, color: '#f59e0b' },
    { name: 'Cancelled', value: 15, color: '#ef4444' }
  ];

  const recentActivities = [
    { id: 1, action: 'New staff member added', user: 'Sarah Johnson', time: '2 hours ago', type: 'staff' },
    { id: 2, action: 'Reservation confirmed', user: 'Room 201', time: '3 hours ago', type: 'reservation' },
    { id: 3, action: 'Payment received', user: 'John Smith', time: '5 hours ago', type: 'payment' },
    { id: 4, action: 'Maintenance request', user: 'Room 305', time: '1 day ago', type: 'maintenance' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'staff': return <Users size={16} className="text-blue-500" />;
      case 'reservation': return <Calendar size={16} className="text-green-500" />;
      case 'payment': return <DollarSign size={16} className="text-purple-500" />;
      case 'maintenance': return <Hotel size={16} className="text-orange-500" />;
      default: return <Eye size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your hotel today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStaff}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">+12.5%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeStaff}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">+8.2%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalReservations}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Calendar size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">+15.3%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">+22.1%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Reservations Chart */}
        <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Reservations Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reservations" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
              <button className="btn btn-primary btn-sm">
                <Plus size={16} className="mr-2" />
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{activity.action}</h3>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="lg:col-span-1">
          <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Status</h2>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Manage Staff</h3>
              <p className="text-blue-100 text-sm mt-1">Add, edit, and manage your team</p>
            </div>
            <Users size={32} className="text-blue-200" />
          </div>
          <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
            Manage Staff
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">View Reservations</h3>
              <p className="text-green-100 text-sm mt-1">Monitor bookings and guest details</p>
            </div>
            <Calendar size={32} className="text-green-200" />
          </div>
          <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
            View Reservations
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Analytics</h3>
              <p className="text-purple-100 text-sm mt-1">Detailed reports and insights</p>
            </div>
            <TrendingUp size={32} className="text-purple-200" />
          </div>
          <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
