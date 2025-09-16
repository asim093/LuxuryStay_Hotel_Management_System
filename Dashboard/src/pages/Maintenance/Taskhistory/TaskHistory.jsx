import React, { useState, useEffect, useMemo } from 'react';
import {
    History,
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    User,
    AlertTriangle,
    Calendar,
    DollarSign,
    FileText,
    Trash2,
    AlertCircle,
    ChevronUp,
    ChevronDown,
    ArrowUpDown,
    MapPin,
    Settings,
    ClipboardList,
    Zap,
    Home,
    Droplets,
    Wifi,
    Thermometer,
    RefreshCw,
    Camera,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Download,
    Filter as FilterIcon,
    CalendarDays,
    Timer,
    Banknote,
    Star,
    ToolCase
} from 'lucide-react';

const TaskHistoryPage = () => {
    // Mock completed tasks data
    const [completedTasks, setCompletedTasks] = useState([
        {
            _id: '1',
            taskNumber: 'MT-001',
            title: 'Air Conditioning Repair',
            description: 'AC unit in Room 205 was not cooling properly. Replaced faulty compressor and cleaned filters.',
            priority: 'High',
            status: 'Completed',
            category: 'HVAC',
            location: 'Room 205',
            reportedBy: { name: 'John Doe', role: 'Front Desk' },
            assignedTo: { name: 'Mike Johnson', role: 'Maintenance' },
            createdAt: '2024-01-10T10:30:00Z',
            completedAt: '2024-01-11T16:45:00Z',
            dueDate: '2024-01-12T18:00:00Z',
            estimatedCost: 150,
            actualCost: 180,
            estimatedHours: 2,
            actualHours: 2.5,
            satisfaction: 5,
            materials: ['Compressor', 'Air Filter', 'Coolant'],
            notes: [
                { text: 'Diagnosed faulty compressor. Ordered replacement part.', timestamp: '2024-01-10T14:00:00Z', author: 'Mike Johnson' },
                { text: 'Replaced compressor and tested system. Working properly.', timestamp: '2024-01-11T16:00:00Z', author: 'Mike Johnson' }
            ]
        },
        {
            _id: '2',
            taskNumber: 'MT-002',
            title: 'Plumbing - Leaky Faucet',
            description: 'Bathroom faucet in Room 102 had persistent drip. Replaced washer and O-ring.',
            priority: 'Medium',
            status: 'Completed',
            category: 'Plumbing',
            location: 'Room 102',
            reportedBy: { name: 'Sarah Wilson', role: 'Housekeeping' },
            assignedTo: { name: 'Tom Brown', role: 'Maintenance' },
            createdAt: '2024-01-08T14:20:00Z',
            completedAt: '2024-01-09T11:30:00Z',
            dueDate: '2024-01-10T12:00:00Z',
            estimatedCost: 25,
            actualCost: 20,
            estimatedHours: 1,
            actualHours: 0.5,
            satisfaction: 4,
            materials: ['Washer', 'O-ring'],
            notes: [
                { text: 'Quick fix. Replaced worn washer.', timestamp: '2024-01-09T11:00:00Z', author: 'Tom Brown' }
            ]
        },
        {
            _id: '3',
            taskNumber: 'MT-003',
            title: 'Electrical - Light Fixture',
            description: 'Ceiling light in lobby area was flickering. Replaced ballast and cleaned connections.',
            priority: 'Low',
            status: 'Completed',
            category: 'Electrical',
            location: 'Lobby',
            reportedBy: { name: 'Emma Davis', role: 'Manager' },
            assignedTo: { name: 'Mike Johnson', role: 'Maintenance' },
            createdAt: '2024-01-05T08:45:00Z',
            completedAt: '2024-01-06T14:15:00Z',
            dueDate: '2024-01-08T17:00:00Z',
            estimatedCost: 50,
            actualCost: 45,
            estimatedHours: 1,
            actualHours: 0.75,
            satisfaction: 5,
            materials: ['Ballast', 'Wire nuts'],
            notes: [
                { text: 'Replaced faulty ballast and cleaned fixture.', timestamp: '2024-01-06T14:00:00Z', author: 'Mike Johnson' }
            ]
        },
        {
            _id: '4',
            taskNumber: 'MT-004',
            title: 'Internet Connectivity Issue',
            description: 'WiFi signal weak in conference room. Installed signal booster and repositioned access point.',
            priority: 'High',
            status: 'Completed',
            category: 'Technology',
            location: 'Conference Room A',
            reportedBy: { name: 'Alex Chen', role: 'IT Support' },
            assignedTo: { name: 'Mike Johnson', role: 'Maintenance' },
            createdAt: '2024-01-03T16:00:00Z',
            completedAt: '2024-01-04T12:30:00Z',
            dueDate: '2024-01-05T10:00:00Z',
            estimatedCost: 200,
            actualCost: 175,
            estimatedHours: 3,
            actualHours: 2.5,
            satisfaction: 4,
            materials: ['WiFi Booster', 'Ethernet Cable'],
            notes: [
                { text: 'Installed signal booster. Signal strength improved significantly.', timestamp: '2024-01-04T12:00:00Z', author: 'Mike Johnson' }
            ]
        },
        {
            _id: '5',
            taskNumber: 'MT-005',
            title: 'Preventive Maintenance - HVAC',
            description: 'Monthly HVAC system inspection and filter replacement completed successfully.',
            priority: 'Medium',
            status: 'Completed',
            category: 'HVAC',
            location: 'Roof Top - HVAC Units',
            reportedBy: { name: 'System', role: 'Automated' },
            assignedTo: { name: 'Tom Brown', role: 'Maintenance' },
            createdAt: '2024-01-01T00:00:00Z',
            completedAt: '2024-01-02T15:45:00Z',
            dueDate: '2024-01-03T16:00:00Z',
            estimatedCost: 100,
            actualCost: 95,
            estimatedHours: 4,
            actualHours: 3.5,
            satisfaction: 5,
            materials: ['Air Filters', 'Lubricant', 'Cleaning Supplies'],
            notes: [
                { text: 'All systems running optimally. Replaced filters and lubricated motors.', timestamp: '2024-01-02T15:00:00Z', author: 'Tom Brown' }
            ]
        },
        {
            _id: '6',
            taskNumber: 'MT-006',
            title: 'Door Lock Replacement',
            description: 'Electronic door lock in Room 301 was malfunctioning. Replaced with new smart lock.',
            priority: 'Medium',
            status: 'Completed',
            category: 'General',
            location: 'Room 301',
            reportedBy: { name: 'Lisa Martinez', role: 'Housekeeping' },
            assignedTo: { name: 'Tom Brown', role: 'Maintenance' },
            createdAt: '2023-12-28T09:15:00Z',
            completedAt: '2023-12-29T13:30:00Z',
            dueDate: '2023-12-30T17:00:00Z',
            estimatedCost: 120,
            actualCost: 115,
            estimatedHours: 1.5,
            actualHours: 1.25,
            satisfaction: 4,
            materials: ['Smart Lock', 'Batteries', 'Screws'],
            notes: [
                { text: 'Old lock removed successfully. New smart lock installed and tested.', timestamp: '2023-12-29T13:00:00Z', author: 'Tom Brown' }
            ]
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'completedAt', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        assignedTo: '',
        priority: '',
        dateFrom: '',
        dateTo: '',
        satisfactionMin: ''
    });

    // Priority and status configurations
    const priorityConfig = {
        'Low': { color: 'bg-green-100 text-green-800 border-green-200', icon: Clock },
        'Medium': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertTriangle },
        'High': { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
        'Critical': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Zap }
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

    // Handle task details view
    const viewTaskDetails = (task) => {
        setSelectedTask(task);
        setShowDetailModal(true);
    };

    // Filter tasks
    const filteredTasks = useMemo(() => {
        return completedTasks.filter(task => {
            const matchesSearch = !filters.search ||
                task.taskNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
                task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                task.location.toLowerCase().includes(filters.search.toLowerCase());

            const matchesCategory = !filters.category || task.category === filters.category;
            const matchesPriority = !filters.priority || task.priority === filters.priority;
            const matchesAssignedTo = !filters.assignedTo || task.assignedTo?.name.toLowerCase().includes(filters.assignedTo.toLowerCase());

            const matchesDateFrom = !filters.dateFrom ||
                new Date(task.completedAt).toISOString().split('T')[0] >= filters.dateFrom;

            const matchesDateTo = !filters.dateTo ||
                new Date(task.completedAt).toISOString().split('T')[0] <= filters.dateTo;

            const matchesSatisfaction = !filters.satisfactionMin ||
                task.satisfaction >= parseInt(filters.satisfactionMin);

            return matchesSearch && matchesCategory && matchesPriority && matchesAssignedTo &&
                matchesDateFrom && matchesDateTo && matchesSatisfaction;
        });
    }, [completedTasks, filters]);
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => current?.[key], obj) || '';
    };
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
            category: '',
            assignedTo: '',
            priority: '',
            dateFrom: '',
            dateTo: '',
            satisfactionMin: ''
        });
        setCurrentPage(1);
    };

    // Get analytics data
    const analytics = useMemo(() => {
        const totalTasks = completedTasks.length;
        const totalCost = completedTasks.reduce((sum, task) => sum + (task.actualCost || 0), 0);
        const totalHours = completedTasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
        const avgSatisfaction = totalTasks > 0 ? completedTasks.reduce((sum, task) => sum + (task.satisfaction || 0), 0) / totalTasks : 0;

        const costVariance = completedTasks.reduce((sum, task) => {
            return sum + ((task.actualCost || 0) - (task.estimatedCost || 0));
        }, 0);

        const timeVariance = completedTasks.reduce((sum, task) => {
            return sum + ((task.actualHours || 0) - (task.estimatedHours || 0));
        }, 0);

        const onTimeCompletion = completedTasks.filter(task =>
            new Date(task.completedAt) <= new Date(task.dueDate)
        ).length;

        const categoryBreakdown = completedTasks.reduce((acc, task) => {
            acc[task.category] = (acc[task.category] || 0) + 1;
            return acc;
        }, {});

        return {
            totalTasks,
            totalCost,
            totalHours,
            avgSatisfaction: avgSatisfaction.toFixed(1),
            costVariance,
            timeVariance,
            onTimeCompletion,
            onTimePercentage: totalTasks > 0 ? ((onTimeCompletion / totalTasks) * 100).toFixed(1) : '0',
            categoryBreakdown
        };
    }, [completedTasks]);

    // Sort icon component
    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) {
            return <ArrowUpDown size={14} className="text-gray-400" />;
        }
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={14} className="text-green-600" />
            : <ChevronDown size={14} className="text-green-600" />;
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate task duration
    const calculateDuration = (createdAt, completedAt) => {
        const start = new Date(createdAt);
        const end = new Date(completedAt);
        const diffHours = Math.abs(end - start) / (1000 * 60 * 60);

        if (diffHours < 24) {
            return `${diffHours.toFixed(1)}h`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            const remainingHours = Math.floor(diffHours % 24);
            return `${diffDays}d ${remainingHours}h`;
        }
    };

    // Generate satisfaction stars
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={14}
                className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
        ));
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
                                    <History className="h-8 w-8 text-green-600" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900">Task History</h1>
                            </div>
                            <p className="text-gray-600">View completed maintenance tasks and performance analytics</p>
                        </div>
                        <div className="flex-shrink-0 flex gap-3">
                            <button className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors gap-2">
                                <Download size={16} />
                                Export Report
                            </button>
                            <button className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors gap-2">
                                <BarChart3 size={16} />
                                Analytics
                            </button>
                        </div>
                    </div>
                </div>

                {/* Analytics Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.totalTasks}</p>
                                <p className="text-xs text-green-600 mt-1">All time</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                                <p className="text-2xl font-bold text-gray-900">Rs. {analytics.totalCost.toLocaleString()}</p>
                                <div className="flex items-center mt-1">
                                    {analytics.costVariance >= 0 ? (
                                        <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                                    )}
                                    <p className={`text-xs ${analytics.costVariance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {analytics.costVariance >= 0 ? '+' : ''}Rs. {analytics.costVariance}
                                    </p>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Banknote className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.totalHours.toFixed(1)}h</p>
                                <div className="flex items-center mt-1">
                                    {analytics.timeVariance >= 0 ? (
                                        <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                                    )}
                                    <p className={`text-xs ${analytics.timeVariance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {analytics.timeVariance >= 0 ? '+' : ''}{analytics.timeVariance.toFixed(1)}h
                                    </p>
                                </div>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Timer className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Avg Satisfaction</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-2xl font-bold text-gray-900">{analytics.avgSatisfaction}</p>
                                    <div className="flex">{renderStars(Math.round(parseFloat(analytics.avgSatisfaction)))}</div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Out of 5 stars</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <User className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">On-Time Completion</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-green-600">{analytics.onTimePercentage}%</p>
                                <p className="text-sm text-gray-600">{analytics.onTimeCompletion} of {analytics.totalTasks} tasks</p>
                            </div>
                            <div className="p-4 bg-green-100 rounded-lg">
                                <CalendarDays className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
                        <div className="space-y-3">
                            {Object.entries(analytics.categoryBreakdown).map(([category, count]) => {
                                const CategoryIcon = categoryIcons[category] || ToolCase;
                                const percentage = analytics.totalTasks > 0 ? ((count / analytics.totalTasks) * 100).toFixed(1) : '0';
                                return (
                                    <div key={category} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CategoryIcon className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm text-gray-900">{category}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-600">{count}</span>
                                            <span className="text-xs text-gray-500">({percentage}%)</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Filter History</h2>
                        <p className="text-sm text-gray-600">Use filters to analyze specific task data</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                            <select
                                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                            <input
                                type="date"
                                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                            <input
                                type="date"
                                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                value={filters.dateTo}
                                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                            <select
                                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                value={filters.satisfactionMin}
                                onChange={(e) => setFilters(prev => ({ ...prev, satisfactionMin: e.target.value }))}
                            >
                                <option value="">Any Rating</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4+ Stars</option>
                                <option value="3">3+ Stars</option>
                                <option value="2">2+ Stars</option>
                                <option value="1">1+ Stars</option>
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
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
                            <p className="text-gray-600">Loading task history...</p>
                        </div>
                    </div>
                ) : sortedTasks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                        <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No completed tasks found</h3>
                        <p className="text-gray-600 mb-6">
                            {completedTasks.length === 0
                                ? "No tasks have been completed yet."
                                : "Try adjusting your filters to see more results."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Completed Tasks</h3>
                                <p className="text-sm text-gray-600">
                                    Showing {paginatedTasks.length} of {sortedTasks.length} completed tasks
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
                                            onClick={() => handleSort('completedAt')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Completed
                                                <SortIcon column="completedAt" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('actualHours')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Duration
                                                <SortIcon column="actualHours" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('actualCost')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Cost
                                                <SortIcon column="actualCost" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('satisfaction')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Rating
                                                <SortIcon column="satisfaction" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('assignedTo.name')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Technician
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
                                        const CategoryIcon = categoryIcons[task.category] || ToolCase;
                                        const PriorityIcon = priorityInfo?.icon || Clock;
                                        const duration = calculateDuration(task.createdAt, task.completedAt);
                                        const costVariance = (task.actualCost || 0) - (task.estimatedCost || 0);
                                        const timeVariance = (task.actualHours || 0) - (task.estimatedHours || 0);

                                        return (
                                            <tr key={task._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-mono font-semibold text-gray-900">
                                                        {task.taskNumber}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                                                <CategoryIcon className="h-5 w-5 text-green-600" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                                {task.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500 truncate">
                                                                {task.category} • {task.location}
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
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {formatDate(task.completedAt)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {duration} total
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {task.actualHours}h
                                                    </div>
                                                    {timeVariance !== 0 && (
                                                        <div className={`text-xs ${timeVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                            {timeVariance > 0 ? '+' : ''}{timeVariance.toFixed(1)}h
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        Rs. {task.actualCost?.toLocaleString() || '0'}
                                                    </div>
                                                    {costVariance !== 0 && (
                                                        <div className={`text-xs ${costVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                            {costVariance > 0 ? '+' : ''}Rs. {costVariance}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(task.satisfaction)}
                                                        <span className="text-sm text-gray-600 ml-1">
                                                            ({task.satisfaction})
                                                        </span>
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
                                                        <button
                                                            className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded"
                                                            title="Download Report"
                                                        >
                                                            <Download size={16} />
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

                {/* Task Detail Modal */}
                {showDetailModal && selectedTask && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Task Details - {selectedTask.taskNumber}
                                    </h3>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Task Overview */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                                    <CheckCircle size={16} />
                                                    Completed
                                                </span>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${priorityConfig[selectedTask.priority]?.color}`}>
                                                    {selectedTask.priority}
                                                </span>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                                <p className="text-sm text-gray-900">{selectedTask.category}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                <p className="text-sm text-gray-900">{selectedTask.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Task Details */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <p className="text-sm text-gray-900">{selectedTask.title}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <p className="text-sm text-gray-900">{selectedTask.description}</p>
                                    </div>

                                    {/* Timeline */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                                            <p className="text-sm text-gray-900">{formatDate(selectedTask.createdAt)}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                            <p className="text-sm text-gray-900">{formatDate(selectedTask.dueDate)}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Completed</label>
                                            <p className="text-sm text-gray-900">{formatDate(selectedTask.completedAt)}</p>
                                        </div>
                                    </div>

                                    {/* People */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
                                            <p className="text-sm text-gray-900">{selectedTask.reportedBy?.name} ({selectedTask.reportedBy?.role})</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                                            <p className="text-sm text-gray-900">{selectedTask.assignedTo?.name} ({selectedTask.assignedTo?.role})</p>
                                        </div>
                                    </div>

                                    {/* Performance Metrics */}
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="text-md font-medium text-gray-900 mb-3">Performance Metrics</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                                                <p className="text-sm text-gray-900">Rs. {selectedTask.estimatedCost}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cost</label>
                                                <p className="text-sm text-gray-900">Rs. {selectedTask.actualCost}</p>
                                                {((selectedTask.actualCost || 0) - (selectedTask.estimatedCost || 0)) !== 0 && (
                                                    <p className={`text-xs ${((selectedTask.actualCost || 0) - (selectedTask.estimatedCost || 0)) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {((selectedTask.actualCost || 0) - (selectedTask.estimatedCost || 0)) > 0 ? '+' : ''}Rs. {((selectedTask.actualCost || 0) - (selectedTask.estimatedCost || 0))}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                                                <p className="text-sm text-gray-900">{selectedTask.estimatedHours}h</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Hours</label>
                                                <p className="text-sm text-gray-900">{selectedTask.actualHours}h</p>
                                                {((selectedTask.actualHours || 0) - (selectedTask.estimatedHours || 0)) !== 0 && (
                                                    <p className={`text-xs ${((selectedTask.actualHours || 0) - (selectedTask.estimatedHours || 0)) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {((selectedTask.actualHours || 0) - (selectedTask.estimatedHours || 0)) > 0 ? '+' : ''}{((selectedTask.actualHours || 0) - (selectedTask.estimatedHours || 0)).toFixed(1)}h
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Satisfaction & Materials */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Satisfaction</label>
                                            <div className="flex items-center gap-2">
                                                {renderStars(selectedTask.satisfaction)}
                                                <span className="text-sm text-gray-600">({selectedTask.satisfaction}/5)</span>
                                            </div>
                                        </div>
                                        {selectedTask.materials && selectedTask.materials.length > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Materials Used</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedTask.materials.map((material, index) => (
                                                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            {material}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Work Notes */}
                                    {selectedTask.notes && selectedTask.notes.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Work Notes</label>
                                            <div className="space-y-3">
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
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700">
                                        <Download size={16} className="inline mr-2" />
                                        Download Report
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

export default TaskHistoryPage;