import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Star,
  Bed,
  Calendar,
  Sparkles,
  User,
  Clock,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Award,
  ThumbsUp,
  RefreshCw,
  Download,
  FileText
} from 'lucide-react';
import { toast } from 'react-toastify';

const CompletedRoomsManagement = () => {
  const token = useSelector((state) => state.user.token);
  const [completedRooms, setCompletedRooms] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'completedDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [filters, setFilters] = useState({
    search: '',
    cleanedBy: '',
    taskType: '',
    date: '',
    rating: ''
  });

  const [selectedTimeRange, setSelectedTimeRange] = useState('today');

  // Fetch completed rooms data
  const fetchCompletedRooms = async () => {
    setLoading(true);
    try {
      console.log('Fetching completed rooms data...');

      // Fetch completed cleaning tasks with room and staff details
      console.log('Making request to:', 'http://localhost:3001/api/cleaning-tasks/completed');
      console.log('With token:', token ? 'Token exists' : 'No token');
      
      const tasksResponse = await fetch('http://localhost:3001/api/cleaning-tasks/completed', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', tasksResponse.status);
      console.log('Response ok:', tasksResponse.ok);
      
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        console.log('Complete response data:', tasksData);
        console.log('Completed tasks fetched:', tasksData.tasks?.length || 0);
        console.log('Tasks data:', tasksData.tasks);
        setCompletedRooms(tasksData.tasks || []);
        toast.success(`✅ Loaded ${tasksData.tasks?.length || 0} completed tasks`);
      } else {
        const errorText = await tasksResponse.text();
        console.error('Failed to fetch completed tasks. Status:', tasksResponse.status);
        console.error('Error response:', errorText);
        setCompletedRooms([]);
        toast.error(`❌ Failed to fetch completed tasks: ${tasksResponse.status} - ${errorText}`);
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
        console.error('Failed to fetch staff');
        setStaff([]);
      }

    } catch (error) {
      console.error('Error fetching completed rooms data:', error);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedRooms();
  }, []);

  // Calculate time range for filtering
  const getTimeRangeFilter = (range) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
      case 'today':
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
      case 'yesterday':
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        return { start: yesterday, end: today };
      case 'week':
        const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return { start: weekStart, end: now };
      case 'month':
        const monthStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return { start: monthStart, end: now };
      default:
        return null;
    }
  };

  // Get nested value for sorting
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || '';
  };

  // Filter completed rooms
  const filteredRooms = useMemo(() => {
    return completedRooms.filter(room => {
      const matchesSearch = !filters.search || 
        room.room?.roomNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
        room.createdBy?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        room.taskNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
        room.taskType?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCleanedBy = !filters.cleanedBy || room.createdBy?._id === filters.cleanedBy;
      const matchesTaskType = !filters.taskType || room.taskType === filters.taskType;
      const matchesRating = !filters.rating || (room.rating || 0) >= parseInt(filters.rating);
      
      const matchesDate = !filters.date || 
        new Date(room.completedDate).toISOString().split('T')[0] === filters.date;

      // Time range filtering
      const timeRange = getTimeRangeFilter(selectedTimeRange);
      const matchesTimeRange = !timeRange || 
        (new Date(room.completedDate) >= timeRange.start && new Date(room.completedDate) <= timeRange.end);

      return matchesSearch && matchesCleanedBy && matchesTaskType && matchesRating && matchesDate && matchesTimeRange;
    });
  }, [completedRooms, filters, selectedTimeRange]);

  // Sort rooms
  const sortedRooms = useMemo(() => {
    if (!sortConfig.key) return filteredRooms;

    return [...filteredRooms].sort((a, b) => {
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
  }, [filteredRooms, sortConfig]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Pagination
  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedRooms.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedRooms, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedRooms.length / itemsPerPage);

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      cleanedBy: '',
      taskType: '',
      date: '',
      rating: ''
    });
    setSelectedTimeRange('today');
    setCurrentPage(1);
  };

  // Get statistics
  const roomStats = useMemo(() => {
    const timeRange = getTimeRangeFilter(selectedTimeRange);
    const rangeRooms = timeRange ? 
      completedRooms.filter(room => {
        const completedDate = new Date(room.completedDate);
        return completedDate >= timeRange.start && completedDate <= timeRange.end;
      }) : completedRooms;

    return {
      total: rangeRooms.length,
      avgRating: rangeRooms.length > 0 ? 
        (rangeRooms.reduce((sum, room) => sum + (room.rating || 4), 0) / rangeRooms.length).toFixed(1) : 0,
      onTime: rangeRooms.filter(room => 
        (room.actualDuration || 0) <= (room.estimatedDuration || 0)
      ).length,
      efficiency: rangeRooms.length > 0 ? 
        Math.round((rangeRooms.filter(room => 
          (room.actualDuration || 0) <= (room.estimatedDuration || 0)
        ).length / rangeRooms.length) * 100) : 0
    };
  }, [completedRooms, selectedTimeRange]);

  // Sort icon component
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <ArrowUpDown size={14} className="text-gray-400" />;
    }
    return sortConfig.direction === 'asc'
      ? <ChevronUp size={14} className="text-green-600" />
      : <ChevronDown size={14} className="text-green-600" />;
  };

  // Render star rating
  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  // Calculate duration difference
  const getDurationDifference = (estimated, actual) => {
    const diff = actual - estimated;
    const isOnTime = diff <= 0;
    return {
      isOnTime,
      difference: Math.abs(diff),
      text: isOnTime ? 
        (diff === 0 ? 'On Time' : `${Math.abs(diff)}m Early`) : 
        `${diff}m Over`
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Completed Rooms</h1>
              </div>
              <p className="text-gray-600">Track and review all successfully cleaned rooms with performance metrics</p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-3">
              <button
                onClick={() => fetchCompletedRooms()}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 gap-2"
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button
                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 gap-2"
              >
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Range</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'today', label: 'Today' },
              { value: 'yesterday', label: 'Yesterday' },
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeRange === range.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rooms Completed</p>
                <p className="text-2xl font-bold text-gray-900">{roomStats.total}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{roomStats.avgRating}</p>
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On-Time Completion</p>
                <p className="text-2xl font-bold text-gray-900">{roomStats.onTime}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Efficiency Rate</p>
                <p className="text-2xl font-bold text-gray-900">{roomStats.efficiency}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ThumbsUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Filter Completed Rooms</h2>
            <p className="text-sm text-gray-600">Filter rooms by staff, task type, rating, and date</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cleaned By</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                value={filters.cleanedBy}
                onChange={(e) => setFilters(prev => ({ ...prev, cleanedBy: e.target.value }))}
              >
                <option value="">All Staff</option>
                {/* Get unique staff from completed tasks */}
                {Array.from(new Set(completedRooms.map(room => room.createdBy?._id)))
                  .filter(id => id)
                  .map(id => {
                    const staff = completedRooms.find(room => room.createdBy?._id === id)?.createdBy;
                    return (
                      <option key={id} value={id}>{staff?.name}</option>
                    );
                  })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Completion Date</label>
              <input
                type="date"
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                value={filters.date}
                onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
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

        {/* Rooms Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading completed rooms...</p>
            </div>
          </div>
        ) : sortedRooms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No completed rooms found</h3>
            <p className="text-gray-600 mb-6">
              {completedRooms.length === 0
                ? "No rooms have been completed yet."
                : "Try adjusting your filters or time range."
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Completed Rooms List</h3>
                <p className="text-sm text-gray-600">
                  Showing {paginatedRooms.length} of {sortedRooms.length} rooms
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
                      onClick={() => handleSort('createdBy.name')}
                    >
                      <div className="flex items-center gap-2">
                        Cleaned By
                        <SortIcon column="createdBy.name" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('completedDate')}
                    >
                      <div className="flex items-center gap-2">
                        Completed At
                        <SortIcon column="completedDate" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('actualDuration')}
                    >
                      <div className="flex items-center gap-2">
                        Duration
                        <SortIcon column="actualDuration" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('rating')}
                    >
                      <div className="flex items-center gap-2">
                        Rating
                        <SortIcon column="rating" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRooms.map((room) => {
                    const duration = getDurationDifference(room.estimatedDuration, room.actualDuration);
                    
                    return (
                      <tr key={room._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <Bed size={16} className="text-green-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                Room {room.room?.roomNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                {room.room?.roomType} - Floor {room.room?.floor}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Sparkles size={12} />
                            {room.taskType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-purple-600">
                                  {room.createdBy?.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {room.createdBy?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Housekeeping Staff
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            {room.completedDate ? new Date(room.completedDate).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {room.completedDate ? new Date(room.completedDate).toLocaleTimeString() : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex flex-col">
                            <span className="font-medium">{room.actualDuration}m</span>
                            <span className={`text-xs ${duration.isOnTime ? 'text-green-600' : 'text-red-600'}`}>
                              {duration.text}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStarRating(room.rating || 4)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-900 truncate" title={room.notes}>
                              {room.notes || 'No notes'}
                            </p>
                            {room.inspectedBy && (
                              <p className="text-xs text-gray-500">
                                Inspected by: {room.inspectedBy}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              className="text-green-600 hover:text-green-900 hover:bg-green-50 p-1 rounded"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded"
                              title="Generate Report"
                            >
                              <FileText size={16} />
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
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedRooms.length)} of {sortedRooms.length} results
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
                              ? 'bg-green-600 text-white border-green-600'
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

        {/* Performance Summary Card */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-600">Top Performer</h4>
              <p className="text-lg font-semibold text-gray-900">
                {staff.length > 0 ? staff[0].name : 'N/A'}
              </p>
              <p className="text-sm text-gray-500">Highest average rating</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-600">Average Duration</h4>
              <p className="text-lg font-semibold text-gray-900">
                {completedRooms.length > 0 ? 
                  Math.round(completedRooms.reduce((sum, room) => sum + (room.actualDuration || 0), 0) / completedRooms.length) : 0}m
              </p>
              <p className="text-sm text-gray-500">Per room cleaning</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
                <ThumbsUp className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-600">Quality Score</h4>
              <p className="text-lg font-semibold text-gray-900">{roomStats.avgRating}/5</p>
              <p className="text-sm text-gray-500">Average rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedRoomsManagement;