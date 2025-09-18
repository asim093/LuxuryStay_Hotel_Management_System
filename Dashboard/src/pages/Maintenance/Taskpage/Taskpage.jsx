import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  Wrench, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  AlertTriangle,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Trash2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  MapPin,
  Settings,
  Plus,
  ClipboardList,
  Zap,
  Home,
  Droplets,
  Wifi,
  Thermometer,
  RefreshCw,
  FileText,
  Camera,
  Upload,
  ToolCase
} from 'lucide-react';

const MaintenanceTasksPage = () => {
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => {
    if (state.user?.data?.user) return state.user.data.user;
    if (state.user?.data?.data?.user) return state.user.data.data.user;
    if (state.user?.user) return state.user.user;
    return null;
  });
  const userRole = user?.role;
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);

  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
    assignedTo: ''
  });

  const [updateForm, setUpdateForm] = useState({
    status: '',
    notes: '',
    actualHours: '',
    actualCost: '',
    images: []
  });

  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: 'General',
    location: '',
    priority: 'Medium',
    assignedTo: '',
    estimatedDuration: 60,
    estimatedCost: 0,
    scheduledDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [rooms, setRooms] = useState([]);

  // Fetch maintenance tasks data
  const fetchMaintenanceTasks = async () => {
    setLoading(true);
    try {
      console.log('Fetching maintenance tasks...');

      // Fetch maintenance tasks
      const tasksResponse = await fetch('http://localhost:3001/api/maintenance-tasks', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        console.log('Maintenance tasks fetched:', tasksData.tasks?.length || 0);
        setTasks(tasksData.tasks || []);
        toast.success(`✅ Loaded ${tasksData.tasks?.length || 0} maintenance tasks`);
      } else {
        const errorText = await tasksResponse.text();
        console.error('Failed to fetch maintenance tasks. Status:', tasksResponse.status);
        setTasks([]);
        toast.error(`❌ Failed to fetch maintenance tasks: ${tasksResponse.status}`);
      }

      // Fetch maintenance staff
      const staffResponse = await fetch('http://localhost:3001/api/maintenance-tasks/staff', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (staffResponse.ok) {
        const staffData = await staffResponse.json();
        console.log('Staff fetched:', staffData.staff?.length || 0);
        setStaff(staffData.staff || []);
      } else {
        console.error('Failed to fetch staff');
        setStaff([]);
      }

      const roomsResponse = await fetch('http://localhost:3001/api/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        console.log('Rooms fetched:', roomsData.rooms?.length || 0);
        setRooms(roomsData.rooms || []);
      } else {
        console.error('Failed to fetch rooms');
        setRooms([]);
      }

    } catch (error) {
      console.error('Error fetching maintenance data:', error);
      toast.error('❌ Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceTasks();
  }, []);

  // Handle create task
  const handleCreateTask = async () => {
    try {
      const taskData = {
        ...createForm,
        room: createForm.location.includes('Room') ? 
          rooms.find(r => r.roomNumber === createForm.location.replace('Room ', ''))?.id : null,
        estimatedDuration: parseInt(createForm.estimatedDuration),
        estimatedCost: parseFloat(createForm.estimatedCost)
      };

      const response = await fetch('http://localhost:3001/api/maintenance-tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        const result = await response.json();
        setTasks(prev => [result.task, ...prev]);
        toast.success('✅ Maintenance task created and assigned successfully!');
        setShowCreateModal(false);
        setCreateForm({
          title: '',
          description: '',
          category: 'General',
          location: '',
          priority: 'Medium',
          assignedTo: '',
          estimatedDuration: 60,
          estimatedCost: 0,
          scheduledDate: new Date().toISOString().split('T')[0],
          notes: ''
        });
      } else {
        const errorData = await response.json();
        toast.error(`❌ Failed to create task: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('❌ Error creating task');
    }
  };

  // Priority and status configurations
  const priorityConfig = {
    'Low': { color: 'bg-green-100 text-green-800 border-green-200', icon: Clock },
    'Medium': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertTriangle },
    'High': { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
    'Critical': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Zap }
  };

  const statusConfig = {
    'Open': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
    'Scheduled': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Calendar },
    'In Progress': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: RefreshCw },
    'Completed': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
    'On Hold': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle },
    'Cancelled': { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
  };

  const categoryIcons = {
    'HVAC': Thermometer,
    'Plumbing': Droplets,
    'Electrical': Zap,
    'Technology': Wifi,
    'General': ToolCase,
    'Furniture': Home,
    'Cleaning': RefreshCw
  };

  // Handle task status update
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/api/maintenance-tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const result = await response.json();
        setTasks(prev => prev.map(task => 
          task._id === taskId ? result.task : task
        ));
        toast.success(`✅ Task status updated to ${newStatus}`);
      } else {
        toast.error('❌ Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('❌ Error updating task status');
    }
  };

  // Handle task details view
  const viewTaskDetails = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  // Handle task update
  const openUpdateModal = (task) => {
    setSelectedTask(task);
    setUpdateForm({
      status: task.status,
      notes: '',
      actualHours: task.actualHours || '',
      actualCost: task.actualCost || '',
      images: []
    });
    setShowUpdateModal(true);
  };

  // Submit task update
  const submitTaskUpdate = async () => {
    if (!selectedTask) return;

    try {
      const updateData = {
        status: updateForm.status,
        actualHours: updateForm.actualHours ? parseFloat(updateForm.actualHours) : selectedTask.actualHours,
        actualCost: updateForm.actualCost ? parseFloat(updateForm.actualCost) : selectedTask.actualCost,
        notes: updateForm.notes || undefined
      };

      // If completing the task, use the complete endpoint
      if (updateForm.status === 'Completed') {
        const response = await fetch(`http://localhost:3001/api/maintenance-tasks/${selectedTask._id}/complete`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          const result = await response.json();
          setTasks(prev => prev.map(task => 
            task._id === selectedTask._id ? result.task : task
          ));
          toast.success('✅ Task completed successfully!');
        } else {
          toast.error('❌ Failed to complete task');
          return;
        }
      } else {
        // Regular update
        const response = await fetch(`http://localhost:3001/api/maintenance-tasks/${selectedTask._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          const result = await response.json();
          setTasks(prev => prev.map(task => 
            task._id === selectedTask._id ? result.task : task
          ));
          toast.success('✅ Task updated successfully!');
        } else {
          toast.error('❌ Failed to update task');
          return;
        }
      }

      setShowUpdateModal(false);
      setSelectedTask(null);
      setUpdateForm({
        status: '',
        notes: '',
        actualHours: '',
        actualCost: '',
        images: []
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('❌ Error updating task');
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let filteredData = tasks;

    // For maintenance staff, only show their assigned tasks
    if (userRole === 'Maintenance' && user?._id) {
      filteredData = tasks.filter(task => task.assignedTo?._id === user._id);
    }

    return filteredData.filter(task => {
      const matchesSearch = !filters.search || 
        task.taskNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.location.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesCategory = !filters.category || task.category === filters.category;
      const matchesAssignedTo = !filters.assignedTo || task.assignedTo?._id === filters.assignedTo;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssignedTo;
    });
  }, [tasks, filters, userRole, user]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    if (!sortConfig.key) return filteredTasks;

    return [...filteredTasks].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredTasks, sortConfig]);

  // Get nested value for sorting
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || '';
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Pagination
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTasks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      category: '',
      assignedTo: ''
    });
    setCurrentPage(1);
  };

  // Get task statistics
  const taskStats = useMemo(() => ({
    total: tasks.length,
    open: tasks.filter(t => t.status === 'Open').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => new Date(t.scheduledDate) < new Date() && !['Completed', 'Cancelled'].includes(t.status)).length,
    highPriority: tasks.filter(t => ['High', 'Critical'].includes(t.priority)).length
  }), [tasks]);

  // Sort icon component
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <ArrowUpDown size={14} className="text-gray-400" />;
    }
    return sortConfig.direction === 'asc'
      ? <ChevronUp size={14} className="text-indigo-600" />
      : <ChevronDown size={14} className="text-indigo-600" />;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if task is overdue
  const isOverdue = (task) => {
    return new Date(task.scheduledDate) < new Date() && !['Completed', 'Cancelled'].includes(task.status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Wrench className="h-8 w-8 text-orange-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Maintenance Tasks</h1>
              </div>
              <p className="text-gray-600">
                {userRole === 'Maintenance' 
                  ? 'View and update status of your assigned maintenance tasks'
                  : 'Manage and track all maintenance tasks efficiently'
                }
              </p>
            </div>
            {/* Only Managers and Admins can create tasks */}
            {(userRole === 'Manager' || userRole === 'Admin') && (
              <div className="flex-shrink-0">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 gap-2 w-full lg:w-auto"
                >
                  <Plus size={20} />
                  Create & Assign Task
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-2xl font-bold text-blue-600">{taskStats.open}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{taskStats.inProgress}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <RefreshCw className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-purple-600">{taskStats.highPriority}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Filter Tasks</h2>
            <p className="text-sm text-gray-600">Use filters to find specific tasks quickly</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">All Categories</option>
                <option value="HVAC">HVAC</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Technology">Technology</option>
                <option value="General">General</option>
                <option value="Furniture">Furniture</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                value={filters.assignedTo}
                onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
              >
                <option value="">All Staff</option>
                {staff.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-4"></div>
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">
              {tasks.length === 0
                ? "No maintenance tasks available at the moment."
                : "Try adjusting your filters or search terms."
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Tasks List</h3>
                <p className="text-sm text-gray-600">
                  Showing {paginatedTasks.length} of {sortedTasks.length} tasks
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('taskNumber')}
                    >
                      <div className="flex items-center gap-2">
                        Task #
                        <SortIcon column="taskNumber" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center gap-2">
                        Task Details
                        <SortIcon column="title" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('priority')}
                    >
                      <div className="flex items-center gap-2">
                        Priority
                        <SortIcon column="priority" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        <SortIcon column="status" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('scheduledDate')}
                    >
                      <div className="flex items-center gap-2">
                        Scheduled Date
                        <SortIcon column="scheduledDate" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('assignedTo.name')}
                    >
                      <div className="flex items-center gap-2">
                        Assigned To
                        <SortIcon column="assignedTo.name" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTasks.map((task) => {
                    const priorityInfo = priorityConfig[task.priority];
                    const statusInfo = statusConfig[task.status];
                    const CategoryIcon = categoryIcons[task.category] || ToolCase;
                    const PriorityIcon = priorityInfo?.icon || Clock;
                    const StatusIcon = statusInfo?.icon || Clock;

                    return (
                      <tr key={task._id} className={`hover:bg-gray-50 ${isOverdue(task) ? 'bg-red-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-semibold text-gray-900">
                            {task.taskNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <CategoryIcon className="h-5 w-5 text-orange-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {task.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {task.category} • {task.location}
                              </div>
                              {isOverdue(task) && (
                                <div className="text-xs text-red-600 font-medium">
                                  OVERDUE
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                            <PriorityIcon size={12} />
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                            <StatusIcon size={12} />
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className={isOverdue(task) ? 'text-red-600 font-medium' : ''}>
                            {formatDate(task.scheduledDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-indigo-600">
                                  {task.assignedTo?.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {task.assignedTo?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => viewTaskDetails(task)}
                              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-1 rounded"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            
                            {/* Only Managers and Admins can edit tasks */}
                            {(userRole === 'Manager' || userRole === 'Admin') && (
                              <button
                                onClick={() => openUpdateModal(task)}
                                className="text-orange-600 hover:text-orange-900 hover:bg-orange-50 p-1 rounded"
                                title="Update Task"
                              >
                                <Edit size={16} />
                              </button>
                            )}
                            
                            {task.status === 'Open' && (
                              <button
                                onClick={() => handleStatusUpdate(task._id, 'In Progress')}
                                className="text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 p-1 rounded"
                                title="Start Task"
                              >
                                <RefreshCw size={16} />
                              </button>
                            )}
                            
                            {task.status === 'In Progress' && (
                              <button
                                onClick={() => handleStatusUpdate(task._id, 'Completed')}
                                className="text-green-600 hover:text-green-900 hover:bg-green-50 p-1 rounded"
                                title="Complete Task"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedTasks.length)} of {sortedTasks.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 text-sm border rounded-md ${currentPage === pageNum
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Task Detail Modal */}
        {showDetailModal && selectedTask && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Task Details</h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Task Number</label>
                      <p className="text-sm text-gray-900 font-mono">{selectedTask.taskNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <p className="text-sm text-gray-900">{selectedTask.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityConfig[selectedTask.priority]?.color}`}>
                        {selectedTask.priority}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[selectedTask.status]?.color}`}>
                        {selectedTask.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <p className="text-sm text-gray-900">{selectedTask.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedTask.scheduledDate)}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <p className="text-sm text-gray-900">{selectedTask.title}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-sm text-gray-900">{selectedTask.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
                      <p className="text-sm text-gray-900">{selectedTask.reportedBy?.name} ({selectedTask.reportedBy?.role})</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                      <p className="text-sm text-gray-900">{selectedTask.assignedTo?.name} ({selectedTask.assignedTo?.role})</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                      <p className="text-sm text-gray-900">Rs. {selectedTask.estimatedCost}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cost</label>
                      <p className="text-sm text-gray-900">Rs. {selectedTask.actualCost || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                      <p className="text-sm text-gray-900">{selectedTask.estimatedHours}h</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Actual Hours</label>
                      <p className="text-sm text-gray-900">{selectedTask.actualHours || 'Not set'}h</p>
                    </div>
                  </div>

                  {selectedTask.notes && selectedTask.notes.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <div className="space-y-2">
                        {selectedTask.notes.map((note, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-900">{note.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {note.author} - {formatDate(note.timestamp)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Close
                  </button>
                  {/* Only Managers and Admins can update tasks */}
                  {(userRole === 'Manager' || userRole === 'Admin') && (
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        openUpdateModal(selectedTask);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700"
                    >
                      Update Task
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Update Modal */}
        {showUpdateModal && selectedTask && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Update Task: {selectedTask.taskNumber}</h3>
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={updateForm.status}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, status: e.target.value }))}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="Open">Open</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Actual Hours</label>
                      <input
                        type="number"
                        step="0.5"
                        value={updateForm.actualHours}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, actualHours: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter actual hours"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Actual Cost</label>
                      <input
                        type="number"
                        value={updateForm.actualCost}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, actualCost: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter actual cost"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add Note</label>
                    <textarea
                      value={updateForm.notes}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Add notes about work performed, materials used, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload or drag and drop images
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitTaskUpdate}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700"
                  >
                    Update Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Task Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create & Assign Maintenance Task</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                    <input
                      type="text"
                      value={createForm.title}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Fix air conditioning in Room 205"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={createForm.description}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Detailed description of the maintenance issue..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={createForm.category}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, category: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="General">General</option>
                        <option value="HVAC">HVAC</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Technology">Technology</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Cleaning">Cleaning</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={createForm.priority}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      value={createForm.location}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, location: e.target.value }))}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Room 205, Lobby, Roof Top, Conference Room A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Staff *</label>
                    <select
                      value={createForm.assignedTo}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select maintenance staff...</option>
                      {staff.map(s => (
                        <option key={s._id} value={s._id}>{s.name} - {s.role}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                      <input
                        type="date"
                        value={createForm.scheduledDate}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Est. Duration (minutes)</label>
                      <input
                        type="number"
                        value={createForm.estimatedDuration}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        min="15"
                        step="15"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Est. Cost (Rs.)</label>
                      <input
                        type="number"
                        value={createForm.estimatedCost}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, estimatedCost: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        min="0"
                        step="50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      value={createForm.notes}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Any additional instructions or notes..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTask}
                    disabled={!createForm.title || !createForm.description || !createForm.location || !createForm.assignedTo}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create & Assign Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceTasksPage;