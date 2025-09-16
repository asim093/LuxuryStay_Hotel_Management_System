import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Bed,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  Trash2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  ClipboardCheck,
  Timer,
  Star
} from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '../../../components/Modal/Modal';
import swal from 'sweetalert';

const CleaningTasksManagement = () => {
  const token = useSelector((state) => state.user.token);
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, mode: null, data: null });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assignedTo: '',
    taskType: '',
    dueDate: ''
  });

  const [formData, setFormData] = useState({
    room: '',
    assignedTo: '',
    taskType: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
    dueTime: '',
    instructions: '',
    estimatedDuration: 30
  });

  const openModal = (mode, data = null) => {
    setModal({ show: true, mode, data });
  };

  const closeModal = () => {
    setModal({ show: false, mode: null, data: null });
  };

  const getFormFields = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;

    return [
      { 
        name: 'room', 
        label: 'Room', 
        type: 'select', 
        required: true, 
        options: rooms.map(r => ({ 
          value: r._id, 
          label: `Room ${r.roomNumber} - ${r.roomType} (${r.status})` 
        })) 
      },
      { 
        name: 'assignedTo', 
        label: 'Assign To', 
        type: 'select', 
        required: true, 
        options: staff.map(s => ({ 
          value: s._id, 
          label: `${s.name} - ${s.role}` 
        })) 
      },
      {
        name: 'taskType', 
        label: 'Task Type', 
        type: 'select', 
        required: true, 
        options: [
          { value: 'Regular Cleaning', label: 'Regular Cleaning' },
          { value: 'Deep Cleaning', label: 'Deep Cleaning' },
          { value: 'Checkout Cleaning', label: 'Checkout Cleaning' },
          { value: 'Maintenance Check', label: 'Maintenance Check' },
          { value: 'Inspection', label: 'Inspection' },
          { value: 'Restocking', label: 'Restocking' },
          { value: 'Emergency Cleaning', label: 'Emergency Cleaning' }
        ]
      },
      {
        name: 'priority', 
        label: 'Priority', 
        type: 'select', 
        required: true, 
        options: [
          { value: 'Low', label: 'Low Priority' },
          { value: 'Medium', label: 'Medium Priority' },
          { value: 'High', label: 'High Priority' },
          { value: 'Urgent', label: 'Urgent' }
        ]
      },
      { 
        name: 'dueDate', 
        label: 'Due Date', 
        type: 'date', 
        required: true, 
        inputProps: { min: minDate } 
      },
      { 
        name: 'dueTime', 
        label: 'Due Time', 
        type: 'time', 
        required: true 
      },
      { 
        name: 'estimatedDuration', 
        label: 'Estimated Duration (minutes)', 
        type: 'number', 
        required: true, 
        inputProps: { min: 15, max: 480, step: 15 } 
      },
      { 
        name: 'instructions', 
        label: 'Special Instructions', 
        type: 'textarea', 
        required: false,
        inputProps: { rows: 3, placeholder: 'Any special cleaning instructions or notes...' }
      }
    ];
  };

  const statusConfig = {
    'Pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
    'In Progress': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Timer },
    'Completed': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
    'On Hold': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertCircle },
    'Cancelled': { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
  };

  const priorityConfig = {
    'Low': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Star },
    'Medium': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Star },
    'High': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Star },
    'Urgent': { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle }
  };

  const taskTypeConfig = {
    'Regular Cleaning': { color: 'bg-blue-100 text-blue-800', icon: Sparkles },
    'Deep Cleaning': { color: 'bg-purple-100 text-purple-800', icon: Star },
    'Checkout Cleaning': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    'Maintenance Check': { color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
    'Inspection': { color: 'bg-indigo-100 text-indigo-800', icon: Eye },
    'Restocking': { color: 'bg-pink-100 text-pink-800', icon: Plus },
    'Emergency Cleaning': { color: 'bg-red-100 text-red-800', icon: AlertCircle }
  };

  // Fetch data from APIs
  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching cleaning tasks data...');

      // Fetch cleaning tasks
      const tasksResponse = await fetch('http://localhost:3001/api/cleaning-tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        console.log('Tasks fetched:', tasksData.tasks?.length || 0);
        setTasks(tasksData.tasks || []);
      } else {
        console.error('Failed to fetch tasks');
        // Fallback mock data
        setTasks([
          {
            _id: '1',
            taskNumber: 'CT001',
            room: { _id: 'r1', roomNumber: '101', roomType: 'Standard', status: 'Dirty' },
            assignedTo: { _id: 's1', name: 'Maria Garcia', role: 'Housekeeping' },
            taskType: 'Checkout Cleaning',
            priority: 'High',
            status: 'Pending',
            dueDate: new Date().toISOString(),
            dueTime: '14:00',
            estimatedDuration: 45,
            instructions: 'Guest checkout - thorough cleaning required',
            createdAt: new Date().toISOString()
          }
        ]);
      }

      // Fetch rooms
      const roomsResponse = await fetch('http://localhost:3001/api/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        console.log('Rooms fetched:', roomsData.rooms?.length || 0);
        setRooms(roomsData.rooms || []);
      } else {
        // Fallback mock data
        setRooms([
          { _id: 'r1', roomNumber: '101', roomType: 'Standard', status: 'Dirty' },
          { _id: 'r2', roomNumber: '102', roomType: 'Deluxe', status: 'Clean' }
        ]);
      }

      // Fetch housekeeping staff
      const staffResponse = await fetch('http://localhost:3001/api/user/users/Housekeeping', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (staffResponse.ok) {
        const staffData = await staffResponse.json();
        console.log('Staff fetched:', staffData.users?.length || 0);
        setStaff(staffData.users || []);
      } else {
        // Fallback mock data
        setStaff([
          { _id: 's1', name: 'Maria Garcia', role: 'Housekeeping' },
          { _id: 's2', name: 'John Smith', role: 'Housekeeping' }
        ]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Generate task number helper
  const generateTaskNumber = () => 'CT' + String(Math.floor(1000 + Math.random() * 9000));

  // Handle form submission
  const handleSubmit = async (data) => {
    setLoading(true);
    console.log('Submitting task data:', data);

    try {
      const url = modal.mode === 'edit' && modal.data
        ? `http://localhost:3001/api/cleaning-tasks/${modal.data._id}`
        : 'http://localhost:3001/api/cleaning-tasks';
      
      const method = modal.mode === 'edit' ? 'PUT' : 'POST';

      // Combine date and time for due datetime
      const dueDateTime = new Date(`${data.dueDate}T${data.dueTime}`);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          taskNumber: data.taskNumber || generateTaskNumber(),
          dueDateTime: dueDateTime.toISOString()
        })
      });

      if (response.ok) {
        toast.success(modal.mode === 'edit' ? 'Task updated successfully' : 'Task created successfully');
        closeModal();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save task');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Error saving task');
    } finally {
      setLoading(false);
    }
  };

  // Handle task status update
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      console.log(`Updating task ${taskId} to status: ${newStatus}`);

      const response = await fetch(`http://localhost:3001/api/cleaning-tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Task ${newStatus.toLowerCase()} successfully`);
        fetchData();
      } else {
        toast.error(`Failed to update task status`);
      }
    } catch (error) {
      console.error(`Error updating task status:`, error);
      toast.error(`Error updating task status`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "You will not be able to recover this cleaning task!",
      icon: "warning",
      buttons: ["No, keep it", "Yes, delete it!"],
      dangerMode: true,
    });

    if (willDelete) {
      try {
        const response = await fetch(`http://localhost:3001/api/cleaning-tasks/${taskId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          swal("Deleted!", "The cleaning task has been deleted.", "success");
          fetchData();
        } else {
          const err = await response.json().catch(() => ({}));
          swal("Failed!", err.message || "Failed to delete task", "error");
        }
      } catch (e) {
        console.error("Delete task error:", e);
        swal("Error!", "Something went wrong while deleting.", "error");
      }
    } else {
      swal("Cancelled", "Your task is safe!", "info");
    }
  };

  // Handle edit task
  const handleEdit = (task) => {
    console.log('Editing task:', task);
    openModal('edit', task);
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = !filters.search || 
        task.taskNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.room?.roomNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.assignedTo?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.taskType?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesAssignedTo = !filters.assignedTo || task.assignedTo?._id === filters.assignedTo;
      const matchesTaskType = !filters.taskType || task.taskType === filters.taskType;
      
      const matchesDueDate = !filters.dueDate || 
        new Date(task.dueDate).toISOString().split('T')[0] === filters.dueDate;

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignedTo && matchesTaskType && matchesDueDate;
    });
  }, [tasks, filters]);

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
      assignedTo: '',
      taskType: '',
      dueDate: ''
    });
    setCurrentPage(1);
  };

  // Get task statistics
  const taskStats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      const now = new Date();
      return dueDate < now && t.status !== 'Completed';
    }).length,
    urgent: tasks.filter(t => t.priority === 'Urgent').length
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <ClipboardCheck className="h-8 w-8 text-pink-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Cleaning Tasks</h1>
              </div>
              <p className="text-gray-600">Manage and track all housekeeping cleaning tasks efficiently</p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => openModal('add')}
                className="inline-flex items-center justify-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 gap-2 w-full lg:w-auto"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    New Task
                  </>
                )}
              </button>
            </div>
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
                <ClipboardCheck className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{taskStats.pending}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Timer className="h-5 w-5 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-orange-600">{taskStats.urgent}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Filter Tasks</h2>
            <p className="text-sm text-gray-600">Use filters to find specific cleaning tasks quickly</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                value={filters.taskType}
                onChange={(e) => setFilters(prev => ({ ...prev, taskType: e.target.value }))}
              >
                <option value="">All Types</option>
                <option value="Regular Cleaning">Regular Cleaning</option>
                <option value="Deep Cleaning">Deep Cleaning</option>
                <option value="Checkout Cleaning">Checkout Cleaning</option>
                <option value="Maintenance Check">Maintenance Check</option>
                <option value="Inspection">Inspection</option>
                <option value="Restocking">Restocking</option>
                <option value="Emergency Cleaning">Emergency Cleaning</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                value={filters.assignedTo}
                onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
              >
                <option value="">All Staff</option>
                {staff.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                value={filters.dueDate}
                onChange={(e) => setFilters(prev => ({ ...prev, dueDate: e.target.value }))}
              />
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
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-4"></div>
              <p className="text-gray-600">Loading cleaning tasks...</p>
            </div>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <ClipboardCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cleaning tasks found</h3>
            <p className="text-gray-600 mb-6">
              {tasks.length === 0
                ? "Get started by creating your first cleaning task."
                : "Try adjusting your filters or search terms."
              }
            </p>
            <button
              onClick={() => openModal('add')}
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors gap-2"
            >
              <Plus size={16} />
              New Task
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Cleaning Tasks List</h3>
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
                      onClick={() => handleSort('room.roomNumber')}
                    >
                      <div className="flex items-center gap-2">
                        Room
                        <SortIcon column="room.roomNumber" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('taskType')}
                    >
                      <div className="flex items-center gap-2">
                        Task Type
                        <SortIcon column="taskType" />
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
                      onClick={() => handleSort('dueDate')}
                    >
                      <div className="flex items-center gap-2">
                        Due Date/Time
                        <SortIcon column="dueDate" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('estimatedDuration')}
                    >
                      <div className="flex items-center gap-2">
                        Duration
                        <SortIcon column="estimatedDuration" />
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTasks.map((task) => {
                    const statusInfo = statusConfig[task.status];
                    const priorityInfo = priorityConfig[task.priority];
                    const taskTypeInfo = taskTypeConfig[task.taskType];
                    const StatusIcon = statusInfo?.icon || Clock;
                    const PriorityIcon = priorityInfo?.icon || Star;
                    const TaskTypeIcon = taskTypeInfo?.icon || Sparkles;

                    return (
                      <tr key={task._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-semibold text-gray-900">
                            {task.taskNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center">
                                <Bed size={16} className="text-pink-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                Room {task.room?.roomNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                {task.room?.roomType}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${taskTypeInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                            <TaskTypeIcon size={12} />
                            {task.taskType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">
                                  {task.assignedTo?.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {task.assignedTo?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {task.assignedTo?.role}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                            <PriorityIcon size={12} />
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {task.dueTime || 'No time set'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <Clock size={12} className="mr-1" />
                            {task.estimatedDuration}m
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                            <StatusIcon size={12} />
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(task)}
                              className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-1 rounded"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            
                            {task.status === 'Pending' && (
                              <button
                                onClick={() => handleStatusUpdate(task._id, 'In Progress')}
                                className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded"
                                title="Start Task"
                              >
                                <Timer size={16} />
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
                            
                            {!['Completed', 'Cancelled'].includes(task.status) && (
                              <button
                                onClick={() => handleStatusUpdate(task._id, 'On Hold')}
                                className="text-orange-600 hover:text-orange-900 hover:bg-orange-50 p-1 rounded"
                                title="Put On Hold"
                              >
                                <AlertCircle size={16} />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
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
                              ? 'bg-pink-600 text-white border-pink-600'
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

        {/* Add/Edit Task Modal */}
        {modal.show && (
          <Modal
            title={modal.mode === 'edit' ? 'Edit Cleaning Task' : 'Create New Cleaning Task'}
            subtitle={modal.mode === 'edit' ? 'Update cleaning task details' : 'Create a new cleaning task for housekeeping staff'}
            mode={modal.mode}
            data={modal.data ? {
              room: modal.data.room?._id,
              assignedTo: modal.data.assignedTo?._id,
              taskType: modal.data.taskType,
              priority: modal.data.priority || 'Medium',
              status: modal.data.status || 'Pending',
              dueDate: modal.data.dueDate ? new Date(modal.data.dueDate).toISOString().split('T')[0] : '',
              dueTime: modal.data.dueTime || '',
              instructions: modal.data.instructions || '',
              estimatedDuration: modal.data.estimatedDuration || 30
            } : null}
            fields={getFormFields()}
            onClose={closeModal}
            onSubmit={handleSubmit}
            loading={loading}
            errors={{}}
          />
        )}
      </div>
    </div>
  );
};

export default CleaningTasksManagement;