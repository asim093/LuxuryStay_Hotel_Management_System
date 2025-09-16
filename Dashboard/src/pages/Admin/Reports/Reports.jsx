import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Hotel,
  Calendar,
  CreditCard,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Sample data - in real app, this would come from API
  const sampleData = {
    overview: {
      totalRevenue: 125000,
      totalBookings: 342,
      occupancyRate: 78.5,
      averageRating: 4.6,
      revenueChange: 12.5,
      bookingChange: 8.3,
      occupancyChange: -2.1,
      ratingChange: 0.3
    },
    revenue: {
      monthly: [
        { month: 'Jan', revenue: 45000, bookings: 120 },
        { month: 'Feb', revenue: 52000, bookings: 135 },
        { month: 'Mar', revenue: 48000, bookings: 125 },
        { month: 'Apr', revenue: 61000, bookings: 155 },
        { month: 'May', revenue: 58000, bookings: 148 },
        { month: 'Jun', revenue: 67000, bookings: 170 }
      ],
      byRoomType: [
        { type: 'Deluxe', revenue: 45000, percentage: 36 },
        { type: 'Suite', revenue: 35000, percentage: 28 },
        { type: 'Standard', revenue: 25000, percentage: 20 },
        { type: 'Presidential', revenue: 20000, percentage: 16 }
      ]
    },
    bookings: {
      total: 342,
      confirmed: 298,
      pending: 28,
      cancelled: 16,
      bySource: [
        { source: 'Direct Booking', count: 120, percentage: 35 },
        { source: 'Online Travel Agency', count: 95, percentage: 28 },
        { source: 'Phone Booking', count: 78, percentage: 23 },
        { source: 'Walk-in', count: 49, percentage: 14 }
      ]
    },
    occupancy: {
      current: 78.5,
      average: 72.3,
      peak: 95.2,
      low: 45.8,
      byMonth: [
        { month: 'Jan', occupancy: 65 },
        { month: 'Feb', occupancy: 72 },
        { month: 'Mar', occupancy: 68 },
        { month: 'Apr', occupancy: 78 },
        { month: 'May', occupancy: 82 },
        { month: 'Jun', occupancy: 85 }
      ]
    },
    guests: {
      total: 1250,
      new: 320,
      returning: 930,
      averageStay: 3.2,
      satisfaction: 4.6,
      demographics: [
        { category: 'Business', count: 450, percentage: 36 },
        { category: 'Leisure', count: 520, percentage: 42 },
        { category: 'Family', count: 180, percentage: 14 },
        { category: 'Couple', count: 100, percentage: 8 }
      ]
    }
  };

  useEffect(() => {
    loadReportData();
  }, [selectedReport, dateRange]);

  const loadReportData = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setReportData(sampleData[selectedReport] || sampleData.overview);
      setIsLoading(false);
    }, 1000);
  };

  const reportTypes = [
    { id: 'overview', name: 'Overview', icon: BarChart3, description: 'Key performance indicators' },
    { id: 'revenue', name: 'Revenue', icon: TrendingUp, description: 'Financial performance' },
    { id: 'bookings', name: 'Bookings', icon: Calendar, description: 'Reservation analytics' },
    { id: 'occupancy', name: 'Occupancy', icon: Hotel, description: 'Room utilization' },
    { id: 'guests', name: 'Guests', icon: Users, description: 'Guest analytics' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  const renderOverviewReport = () => {
    if (!reportData) return null;

    const { totalRevenue, totalBookings, occupancyRate, averageRating, revenueChange, bookingChange, occupancyChange, ratingChange } = reportData;

    return (
      <div className="space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{revenueChange}%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{bookingChange}%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(occupancyRate)}</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">{occupancyChange}%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Hotel className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{ratingChange}</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue chart would be displayed here</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Sources</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Pie chart would be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRevenueReport = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
            <div className="space-y-3">
              {reportData.monthly?.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{item.month}</span>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(item.revenue)}</p>
                    <p className="text-sm text-gray-500">{item.bookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Room Type</h3>
            <div className="space-y-3">
              {reportData.byRoomType?.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{item.type}</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(item.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">{item.percentage}% of total revenue</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBookingsReport = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-2xl font-bold text-gray-900">{reportData.total}</p>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-2xl font-bold text-green-600">{reportData.confirmed}</p>
            <p className="text-sm text-gray-600">Confirmed</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-2xl font-bold text-yellow-600">{reportData.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-2xl font-bold text-red-600">{reportData.cancelled}</p>
            <p className="text-sm text-gray-600">Cancelled</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Source</h3>
          <div className="space-y-3">
            {reportData.bySource?.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{item.source}</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.count} bookings</p>
                  <p className="text-sm text-gray-500">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderOccupancyReport = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-2xl font-bold text-gray-900">{formatPercentage(reportData.current)}</p>
            <p className="text-sm text-gray-600">Current</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-2xl font-bold text-blue-600">{formatPercentage(reportData.average)}</p>
            <p className="text-sm text-gray-600">Average</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-2xl font-bold text-green-600">{formatPercentage(reportData.peak)}</p>
            <p className="text-sm text-gray-600">Peak</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-2xl font-bold text-red-600">{formatPercentage(reportData.low)}</p>
            <p className="text-sm text-gray-600">Low</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy by Month</h3>
          <div className="space-y-3">
            {reportData.byMonth?.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{item.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.occupancy}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-900 w-12 text-right">{formatPercentage(item.occupancy)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderGuestsReport = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-2xl font-bold text-gray-900">{reportData.total}</p>
            <p className="text-sm text-gray-600">Total Guests</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-2xl font-bold text-green-600">{reportData.new}</p>
            <p className="text-sm text-gray-600">New Guests</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-2xl font-bold text-blue-600">{reportData.returning}</p>
            <p className="text-sm text-gray-600">Returning</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-2xl font-bold text-purple-600">{reportData.averageStay}</p>
            <p className="text-sm text-gray-600">Avg Stay (days)</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-2xl font-bold text-yellow-600">{reportData.satisfaction}</p>
            <p className="text-sm text-gray-600">Satisfaction</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Demographics</h3>
          <div className="space-y-3">
            {reportData.demographics?.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{item.category}</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.count} guests</p>
                  <p className="text-sm text-gray-500">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport();
      case 'revenue':
        return renderRevenueReport();
      case 'bookings':
        return renderBookingsReport();
      case 'occupancy':
        return renderOccupancyReport();
      case 'guests':
        return renderGuestsReport();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into hotel performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button
              onClick={loadReportData}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedReport === report.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-semibold">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-gray-50 rounded-lg p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading report data...</p>
            </div>
          </div>
        ) : (
          renderReportContent()
        )}
      </div>
    </div>
  );
};

export default Reports;
