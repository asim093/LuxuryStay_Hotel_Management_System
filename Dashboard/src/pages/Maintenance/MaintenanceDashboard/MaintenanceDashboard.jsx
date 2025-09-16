import { useState, useEffect } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Eye,
  Settings,
  Zap,
  Droplets,
  Wind,
  Thermometer,
  Calendar,
  Users,
  ToolCase
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const MaintenanceDashboard = () => {
  const [stats, setStats] = useState({
    totalWorkOrders: 0,
    pendingTasks: 0,
    completedToday: 0,
    emergencyIssues: 0
  });

  useEffect(() => {
    // Load data from localStorage or API
    const workOrders = JSON.parse(localStorage.getItem('work_orders') || '[]');
    const maintenanceTasks = JSON.parse(localStorage.getItem('maintenance_tasks') || '[]');
    
    setStats({
      totalWorkOrders: workOrders.length || 24,
      pendingTasks: workOrders.filter(order => order.status === 'Pending').length || 8,
      completedToday: workOrders.filter(order => 
        order.status === 'Completed' && 
        new Date(order.completedAt).toDateString() === new Date().toDateString()
      ).length || 12,
      emergencyIssues: workOrders.filter(order => order.priority === 'Emergency').length || 3
    });
  }, []);

  const chartData = [
    { day: 'Mon', completed: 8, pending: 5, emergency: 2 },
    { day: 'Tue', completed: 12, pending: 3, emergency: 1 },
    { day: 'Wed', completed: 6, pending: 8, emergency: 3 },
    { day: 'Thu', completed: 15, pending: 4, emergency: 1 },
    { day: 'Fri', completed: 10, pending: 6, emergency: 2 },
    { day: 'Sat', completed: 14, pending: 2, emergency: 0 },
    { day: 'Sun', completed: 9, pending: 4, emergency: 1 }
  ];

  const issueTypeData = [
    { name: 'Electrical', value: 35, color: '#fbbf24' },
    { name: 'Plumbing', value: 28, color: '#3b82f6' },
    { name: 'HVAC', value: 20, color: '#10b981' },
    { name: 'Appliances', value: 12, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#6b7280' }
  ];

  const recentWorkOrders = [
    { id: 1, room: '205', issue: 'AC not cooling properly', priority: 'High', assignee: 'John D.', time: '30 mins ago', type: 'hvac' },
    { id: 2, room: '312', issue: 'Leaking faucet in bathroom', priority: 'Medium', assignee: 'Mike S.', time: '1 hour ago', type: 'plumbing' },
    { id: 3, room: '108', issue: 'Light switch not working', priority: 'Low', assignee: 'Sarah L.', time: '2 hours ago', type: 'electrical' },
    { id: 4, room: '401', issue: 'Refrigerator making noise', priority: 'Medium', assignee: 'Tom R.', time: '3 hours ago', type: 'appliance' },
    { id: 5, room: '156', issue: 'Door lock malfunction', priority: 'High', assignee: 'David K.', time: '4 hours ago', type: 'mechanical' }
  ];

  const urgentTasks = [
    { id: 1, room: '203', task: 'Emergency plumbing repair', priority: 'Emergency', deadline: '2:00 PM', assignee: 'Mike S.' },
    { id: 2, room: '115', task: 'Power outage investigation', priority: 'Emergency', deadline: '1:30 PM', assignee: 'John D.' },
    { id: 3, room: '309', task: 'Heating system malfunction', priority: 'High', deadline: '4:00 PM', assignee: 'Sarah L.' },
    { id: 4, room: '278', task: 'Water leak containment', priority: 'Emergency', deadline: '12:30 PM', assignee: 'Tom R.' }
  ];

  const getIssueIcon = (type) => {
    switch (type) {
      case 'electrical': return <Zap size={16} className="text-yellow-500" />;
      case 'plumbing': return <Droplets size={16} className="text-blue-500" />;
      case 'hvac': return <Wind size={16} className="text-green-500" />;
      case 'appliance': return <Settings size={16} className="text-purple-500" />;
      case 'mechanical': return <ToolCase size={16} className="text-orange-500" />;
      default: return <Wrench size={16} className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Emergency': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor work orders, track repairs, and manage maintenance tasks efficiently</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Work Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalWorkOrders}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Wrench size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">+8.5%</span>
            <span className="text-sm text-gray-500 ml-1">from last week</span>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingTasks}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingDown size={16} className="text-red-500" />
            <span className="text-sm font-medium text-red-600 ml-1">-3.2%</span>
            <span className="text-sm text-gray-500 ml-1">from yesterday</span>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completedToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">+12.1%</span>
            <span className="text-sm text-gray-500 ml-1">from yesterday</span>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emergency Issues</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.emergencyIssues}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertTriangle size={24} className="text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <AlertTriangle size={16} className="text-red-500" />
            <span className="text-sm font-medium text-red-600 ml-1">Urgent</span>
            <span className="text-sm text-gray-500 ml-1">attention needed</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Performance */}
        <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Work Orders</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              <Bar dataKey="emergency" fill="#ef4444" name="Emergency" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Efficiency Trend */}
        <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Efficiency Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed Tasks" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Urgent Tasks */}
        <div className="lg:col-span-2">
          <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Urgent Tasks</h2>
              <button className="btn btn-primary btn-sm">
                <Plus size={16} className="mr-2" />
                New Task
              </button>
            </div>
            <div className="space-y-4">
              {urgentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Wrench size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Room {task.room}</h3>
                      <p className="text-sm text-gray-600">{task.task}</p>
                      <p className="text-xs text-gray-500">Assigned to: {task.assignee}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
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

        {/* Issue Type Distribution */}
        <div className="lg:col-span-1">
          <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Issue Types</h2>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={issueTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {issueTypeData.map((entry, index) => (
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

      {/* Recent Work Orders */}
      <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Work Orders</h2>
          <button className="btn btn-outline btn-sm">
            <Eye size={16} className="mr-2" />
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentWorkOrders.map((order) => (
            <div key={order.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {getIssueIcon(order.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">Room {order.room}</h3>
                <p className="text-sm text-gray-600 truncate">{order.issue}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                    {order.priority}
                  </span>
                  <p className="text-xs text-gray-500">{order.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Work Orders</h3>
              <p className="text-orange-100 text-sm mt-1">View and manage all work orders</p>
            </div>
            <Wrench size={32} className="text-orange-200" />
          </div>
          <button className="mt-4 bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors">
            View Orders
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Equipment Status</h3>
              <p className="text-blue-100 text-sm mt-1">Monitor equipment health and alerts</p>
            </div>
            <Settings size={32} className="text-blue-200" />
          </div>
          <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
            Check Equipment
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Maintenance Schedule</h3>
              <p className="text-green-100 text-sm mt-1">Plan and schedule maintenance tasks</p>
            </div>
            <Calendar size={32} className="text-green-200" />
          </div>
          <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
            View Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;