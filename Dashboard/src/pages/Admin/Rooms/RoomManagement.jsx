import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Bed,
  Wifi,
  Car,
  Coffee,
  Waves,
  Mountain,
  Home,
  Building,
  Crown,
  Users,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Currency
} from 'lucide-react';
import { toast } from 'react-toastify';

const RoomManagement = () => {
  const token = useSelector((state) => state.user.token);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    roomType: '',
    floor: ''
  });

  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'Standard',
    floor: '',
    capacity: 1,
    pricePerNight: '',
    amenities: [],
    description: '',
    status: 'Available'
  });

  const roomTypes = [
    { value: 'Standard', label: 'Standard', icon: Home, color: 'bg-blue-100 text-blue-600' },
    { value: 'Deluxe', label: 'Deluxe', icon: Building, color: 'bg-green-100 text-green-600' },
    { value: 'Suite', label: 'Suite', icon: Crown, color: 'bg-purple-100 text-purple-600' },
    { value: 'Presidential', label: 'Presidential', icon: Crown, color: 'bg-yellow-100 text-yellow-600' },
    { value: 'Family', label: 'Family', icon: Users, color: 'bg-pink-100 text-pink-600' }
  ];

  const amenities = [
    { value: 'WiFi', label: 'WiFi', icon: '📶' },
    { value: 'TV', label: 'TV', icon: '📺' },
    { value: 'AC', label: 'Air Conditioning', icon: '❄️' },
    { value: 'Mini Bar', label: 'Mini Bar', icon: '🍷' },
    { value: 'Balcony', label: 'Balcony', icon: '🏞️' },
    { value: 'Ocean View', label: 'Ocean View', icon: '🌊' },
    { value: 'City View', label: 'City View', icon: '🏙️' },
    { value: 'Jacuzzi', label: 'Jacuzzi', icon: '🛁' },
    { value: 'Kitchen', label: 'Kitchen', icon: '🍳' },
    { value: 'Living Room', label: 'Living Room', icon: '🛋️' }
  ];

  const statusConfig = {
    'Available': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
    'Occupied': { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
    'Maintenance': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Settings },
    'Cleaning': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: AlertCircle },
    'Out of Order': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle }
  };

  // Fetch rooms from API
  const fetchRooms = async () => {
    setLoading(true);
    try {
      if (!token) {
        console.error('No token found in Redux state');
        toast.error('Please login again');
        return;
      }

      console.log('Token found:', token.substring(0, 20) + '...');

      const response = await fetch('http://localhost:3001/api/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms || []);
        console.log('Rooms fetched successfully:', data.rooms?.length || 0);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        toast.error(errorData.message || 'Failed to fetch rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Error fetching rooms');
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/test');
      const data = await response.json();
      console.log('Test API response:', data);
    } catch (error) {
      console.error('Test API error:', error);
    }
  };

  useEffect(() => {
    testAPI();
    fetchRooms();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingRoom
        ? `http://localhost:3001/api/rooms/${editingRoom._id}`
        : 'http://localhost:3001/api/rooms';

      const method = editingRoom ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingRoom ? 'Room updated successfully' : 'Room created successfully');
        setShowModal(false);
        setEditingRoom(null);
        resetForm();
        fetchRooms();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save room');
      }
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error('Error saving room');
    } finally {
      setLoading(false);
    }
  };

  // Handle room deletion
  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Room deleted successfully');
        fetchRooms();
      } else {
        toast.error('Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Error deleting room');
    }
  };

  // Handle room status update
  const handleStatusUpdate = async (roomId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/api/rooms/${roomId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success('Room status updated successfully');
        fetchRooms();
      } else {
        toast.error('Failed to update room status');
      }
    } catch (error) {
      console.error('Error updating room status:', error);
      toast.error('Error updating room status');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      roomNumber: '',
      roomType: 'Standard',
      floor: '',
      capacity: 1,
      pricePerNight: '',
      amenities: [],
      description: '',
      status: 'Available'
    });
  };

  // Handle edit room
  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      floor: room.floor,
      capacity: room.capacity,
      pricePerNight: room.pricePerNight,
      amenities: room.amenities || [],
      description: room.description || '',
      status: room.status
    });
    setShowModal(true);
  };

  // Handle amenity toggle
  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = !filters.search ||
      room.roomNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      room.description?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = !filters.status || room.status === filters.status;
    const matchesType = !filters.roomType || room.roomType === filters.roomType;
    const matchesFloor = !filters.floor || room.floor.toString() === filters.floor;

    return matchesSearch && matchesStatus && matchesType && matchesFloor;
  });

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      roomType: '',
      floor: ''
    });
  };

  // Get room statistics
  const roomStats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'Available').length,
    occupied: rooms.filter(r => r.status === 'Occupied').length,
    maintenance: rooms.filter(r => r.status === 'Maintenance').length,
    cleaning: rooms.filter(r => r.status === 'Cleaning').length,
    outOfOrder: rooms.filter(r => r.status === 'Out of Order').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Bed className="h-8 w-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
              </div>
              <p className="text-gray-600">Manage hotel rooms, availability, and maintenance efficiently</p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  resetForm();
                  setEditingRoom(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 gap-2 w-full lg:w-auto"
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
                    Add New Room
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
                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{roomStats.total}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Bed className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{roomStats.available}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-red-600">{roomStats.occupied}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{roomStats.maintenance}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Settings className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cleaning</p>
                <p className="text-2xl font-bold text-blue-600">{roomStats.cleaning}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Order</p>
                <p className="text-2xl font-bold text-gray-600">{roomStats.outOfOrder}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Filter Rooms</h2>
            <p className="text-sm text-gray-600">Use filters to find specific rooms quickly</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Rooms
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by room number..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Out of Order">Out of Order</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={filters.roomType}
                onChange={(e) => setFilters(prev => ({ ...prev, roomType: e.target.value }))}
              >
                <option value="">All Types</option>
                {roomTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={filters.floor}
                onChange={(e) => setFilters(prev => ({ ...prev, floor: e.target.value }))}
              >
                <option value="">All Floors</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(floor => (
                  <option key={floor} value={floor}>Floor {floor}</option>
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

        {/* Rooms Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading rooms...</p>
            </div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <Bed className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600 mb-6">
              {rooms.length === 0
                ? "Get started by adding your first room."
                : "Try adjusting your filters or search terms."
              }
            </p>
            <button
              onClick={() => {
                resetForm();
                setEditingRoom(null);
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors gap-2"
            >
              <Plus size={16} />
              Add Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map((room) => {
              const roomTypeInfo = roomTypes.find(type => type.value === room.roomType);
              const RoomTypeIcon = roomTypeInfo?.icon || Home;
              const statusInfo = statusConfig[room.status];
              const StatusIcon = statusInfo?.icon || CheckCircle;

              return (
                <div key={room._id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                  {/* Status Bar */}
                  <div className={`h-1 w-full ${room.status === 'Available' ? 'bg-green-500' : room.status === 'Occupied' ? 'bg-red-500' : room.status === 'Maintenance' ? 'bg-yellow-500' : room.status === 'Cleaning' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                  
                  <div className="p-6">
                    {/* Room Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Room {room.roomNumber}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <MapPin size={16} className="text-indigo-500" />
                          <span>Floor {room.floor}</span>
                        </div>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${statusInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                        <StatusIcon size={14} />
                        {room.status}
                      </div>
                    </div>

                    {/* Room Type */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-3 rounded-xl ${roomTypeInfo?.color || 'bg-gray-100'} shadow-sm`}>
                        <RoomTypeIcon size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{room.roomType}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} className="text-blue-500" />
                          <span>{room.capacity} guest{room.capacity > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div>
                        <span className="text-2xl font-bold text-green-600">Rs:{room.pricePerNight}</span>
                        <span className="text-sm text-gray-600 ml-1">/night</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Starting from</p>
                      </div>
                    </div>

                    {/* Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Amenities
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.slice(0, 3).map((amenity, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              {amenity}
                            </span>
                          ))}
                          {room.amenities.length > 3 && (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              +{room.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border-2 border-indigo-300 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 transition-all duration-200 gap-2"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(room._id)}
                          className="inline-flex items-center justify-center px-4 py-2.5 border-2 border-red-300 rounded-lg text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 transition-all duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Status Update */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Update Status:</label>
                        <select
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          value={room.status}
                          onChange={(e) => handleStatusUpdate(room._id, e.target.value)}
                        >
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Out of Order">Out of Order</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Room Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingRoom ? 'Edit Room' : 'Add New Room'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingRoom(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Number *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                        required
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacity *
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.capacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                        required
                        min="1"
                        max="10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Price per day (Rs) *
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.pricePerNight}
                        onChange={(e) => setFormData(prev => ({ ...prev, pricePerNight: e.target.value }))}
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        required
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Out of Order">Out of Order</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      placeholder="Optional room description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenities.map((amenity) => (
                        <label key={amenity.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={formData.amenities.includes(amenity.value)}
                            onChange={() => toggleAmenity(amenity.value)}
                          />
                          <span className="text-sm text-gray-700 flex items-center gap-2">
                            <span>{amenity.icon}</span>
                            {amenity.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-6">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setShowModal(false);
                        setEditingRoom(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 transition-colors"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                          {editingRoom ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        editingRoom ? 'Update Room' : 'Create Room'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;