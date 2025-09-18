import { useState, useEffect } from 'react';
import { 
  Bed, 
  ClipboardList, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp, 
  TrendingDown,
  Plus,
  Eye,
  Sparkles,
  Home,
  Calendar,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const HousekeepingDashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    cleanedRooms: 0,
    pendingTasks: 0,
    inventoryAlerts: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rooms data
        const roomsResponse = await fetch('http://localhost:3001/api/rooms', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        let totalRooms = 0;
        let cleanedRooms = 0;

        if (roomsResponse.ok) {
          const roomsData = await roomsResponse.json();
          const rooms = roomsData.rooms || [];
          totalRooms = rooms.length;
          cleanedRooms = rooms.filter(room => room.status === 'Clean' || room.status === 'Available').length;
        }

        // Fetch cleaning tasks data
        const tasksResponse = await fetch('http://localhost:3001/api/cleaning-tasks', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        let pendingTasks = 0;
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          const tasks = tasksData.tasks || [];
          pendingTasks = tasks.filter(task => task.status === 'Pending' || task.status === 'In Progress').length;
        }

        // Fetch inventory data (if available)
        const inventoryResponse = await fetch('http://localhost:3001/api/inventory', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        let inventoryAlerts = 0;
        if (inventoryResponse.ok) {
          const inventoryData = await inventoryResponse.json();
          const inventory = inventoryData.items || [];
          inventoryAlerts = inventory.filter(item => item.quantity < item.minLevel).length;
        }

        setStats({
          totalRooms,
          cleanedRooms,
          pendingTasks,
          inventoryAlerts
        });
      } catch (error) {
        console.error('Error fetching housekeeping data:', error);
        // Set default values if API fails
        setStats({
          totalRooms: 0,
          cleanedRooms: 0,
          pendingTasks: 0,
          inventoryAlerts: 0
        });
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { day: 'Mon', cleaned: 28, inspected: 25, maintenance: 3 },
    { day: 'Tue', cleaned: 32, inspected: 30, maintenance: 2 },
    { day: 'Wed', cleaned: 25, inspected: 22, maintenance: 5 },
    { day: 'Thu', cleaned: 35, inspected: 33, maintenance: 2 },
    { day: 'Fri', cleaned: 30, inspected: 28, maintenance: 4 },
    { day: 'Sat', cleaned: 38, inspected: 35, maintenance: 3 },
    { day: 'Sun', cleaned: 22, inspected: 20, maintenance: 2 }
  ];

  const roomStatusData = [
    { name: 'Clean', value: 65, color: '#10b981' },
    { name: 'Dirty', value: 20, color: '#ef4444' },
    { name: 'Maintenance', value: 10, color: '#f59e0b' },
    { name: 'Out of Order', value: 5, color: '#6b7280' }
  ];

  const recentActivities = [
    { id: 1, action: 'Room 301 cleaned', user: 'Maria Garcia', time: '15 mins ago', type: 'cleaning' },
    { id: 2, action: 'Inventory restocked', user: 'Supply Room A', time: '1 hour ago', type: 'inventory' },
    { id: 3, action: 'Maintenance request', user: 'Room 205', time: '2 hours ago', type: 'maintenance' },
    { id: 4, action: 'Deep cleaning completed', user: 'Presidential Suite', time: '3 hours ago', type: 'deep_clean' },
    { id: 5, action: 'Linen delivery received', user: 'Laundry Department', time: '4 hours ago', type: 'delivery' }
  ];

  const priorityTasks = [
    { id: 1, room: '301', task: 'Guest checkout cleaning', priority: 'High', deadline: '2:00 PM', assignee: 'Maria G.' },
    { id: 2, room: '205', task: 'Maintenance inspection', priority: 'Medium', deadline: '3:30 PM', assignee: 'John D.' },
    { id: 3, room: '410', task: 'Deep cleaning', priority: 'Low', deadline: '5:00 PM', assignee: 'Sarah L.' },
    { id: 4, room: '102', task: 'VIP preparation', priority: 'High', deadline: '1:00 PM', assignee: 'Lisa M.' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'cleaning': return <Sparkles size={16} className="text-blue-500" />;
      case 'inventory': return <Package size={16} className="text-green-500" />;
      case 'maintenance': return <AlertCircle size={16} className="text-orange-500" />;
      case 'deep_clean': return <Bed size={16} className="text-purple-500" />;
      case 'delivery': return <Home size={16} className="text-indigo-500" />;
      default: return <Eye size={16} className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Housekeeping Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor room status, cleaning tasks, and inventory levels.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRooms}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Home size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">100%</span>
            <span className="text-sm text-gray-500 ml-1">operational</span>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cleaned Rooms</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.cleanedRooms}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">+5.2%</span>
            <span className="text-sm text-gray-500 ml-1">from yesterday</span>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingTasks}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-white" />
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
              <p className="text-sm font-medium text-gray-600">Inventory Alerts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.inventoryAlerts}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertCircle size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-sm font-medium text-red-600 ml-1">Low stock</span>
            <span className="text-sm text-gray-500 ml-1">items</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Cleaning Performance */}
        <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cleaned" fill="#10b981" name="Cleaned" />
              <Bar dataKey="inspected" fill="#3b82f6" name="Inspected" />
              <Bar dataKey="maintenance" fill="#f59e0b" name="Maintenance" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cleaning Efficiency Trend */}
        <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Efficiency Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cleaned" stroke="#10b981" strokeWidth={2} name="Rooms Cleaned" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Tasks */}
        <div className="lg:col-span-2">
          <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Priority Tasks</h2>
              <button className="btn btn-primary btn-sm">
                <Plus size={16} className="mr-2" />
                Add Task
              </button>
            </div>
            <div className="space-y-4">
              {priorityTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Bed size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Room {task.room}</h3>
                      <p className="text-sm text-gray-600">{task.task}</p>
                      <p className="text-xs text-gray-500">Assigned to: {task.assignee}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{task.deadline}</p>
                      <p className="text-xs text-gray-500">Deadline</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Room Status Distribution */}
        <div className="lg:col-span-1">
          <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Room Status</h2>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={roomStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roomStatusData.map((entry, index) => (
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

      {/* Recent Activities */}
      <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
          <button className="btn btn-outline btn-sm">
            <Eye size={16} className="mr-2" />
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">{activity.action}</h3>
                <p className="text-sm text-gray-600 truncate">{activity.user}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Room Assignments</h3>
              <p className="text-pink-100 text-sm mt-1">Assign cleaning tasks to staff</p>
            </div>
            <Bed size={32} className="text-pink-200" />
          </div>
          <button className="mt-4 bg-white text-pink-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-50 transition-colors">
            Assign Rooms
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Inventory Check</h3>
              <p className="text-purple-100 text-sm mt-1">Monitor supplies and restocking</p>
            </div>
            <Package size={32} className="text-purple-200" />
          </div>
          <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
            Check Inventory
          </button>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Schedule Tasks</h3>
              <p className="text-indigo-100 text-sm mt-1">Plan and organize cleaning schedule</p>
            </div>
            <Calendar size={32} className="text-indigo-200" />
          </div>
          <button className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
            View Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default HousekeepingDashboard;