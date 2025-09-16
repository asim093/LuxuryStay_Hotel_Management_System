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
  DollarSign,
  Phone,
  Mail,
  Trash2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '../../../components/Modal/Modal';
import swal from 'sweetalert';

const BookingManagement = () => {
  const token = useSelector((state) => state.user.token);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, mode: null, data: null });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    paymentStatus: '',
    checkInDate: '',
    checkOutDate: ''
  });

  const [formData, setFormData] = useState({
    guest: '',
    room: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    paymentMode: '',
    totalAmount: '',
    paymentStatus: 'Pending'
  });

  const openModal = (mode, data = null) => {
    setModal({ show: true, mode, data });
  };

  const closeModal = () => {
    setModal({ show: false, mode: null, data: null });
  };

  const getFormFields = () => {
    const availableRooms = rooms.filter(r => r.status === 'Available');
    const roomSource = availableRooms.length > 0 ? availableRooms : rooms;
    const selectedRoom = rooms.find(r => r._id === formData.room);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    return [
      { name: 'guest', label: 'Guest', type: 'select', required: true, options: guests.map(g => ({ value: g._id, label: `${g.name}` })) },
      { name: 'room', label: 'Room', type: 'select', required: true, options: roomSource.map(r => ({ value: r._id, label: `Room ${r.roomNumber} - ${r.roomType} ` })) },
      { name: 'checkInDate', label: 'Check-in Date', type: 'date', required: true, inputProps: { min: minDate } },
      { name: 'checkOutDate', label: 'Check-out Date', type: 'date', required: true, inputProps: { min: minDate } },
      { name: 'numberOfGuests', label: 'Number of Guests', type: 'number', required: true, inputProps: { min: 1, max: selectedRoom?.capacity || 10 } },
      {
        name: 'paymentMode', label: 'Payment Mode', type: 'select', required: true, options: [
          { value: 'Online', label: 'Online' },
          { value: 'Cash', label: 'Cash' },
        ]
      },
      {
        name: 'paymentStatus', label: 'Payment Status', type: 'select', required: true, options: [
          { value: 'Pending', label: 'Pending' },
          { value: 'Paid', label: 'Paid' },
          { value: 'Partially Paid', label: 'Partially Paid' },
          { value: 'Refunded', label: 'Refunded' },
        ]
      },
    ];
  };

  const statusConfig = {
    'Pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
    'Confirmed': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
    'Checked In': { color: 'bg-green-100 text-green-800 border-green-200', icon: User },
    'Checked Out': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle },
    'Cancelled': { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
    'No Show': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertCircle }
  };

  const paymentStatusConfig = {
    'Pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
    'Paid': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
    'Partially Paid': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: DollarSign },
    'Refunded': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle }
  };

  // Fetch data from APIs
  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching booking data...');

      // Fetch bookings
      const bookingsResponse = await fetch('http://localhost:3001/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        console.log('Bookings fetched:', bookingsData.bookings?.length || 0);
        setBookings(bookingsData.bookings || []);
      } else {
        console.error('Failed to fetch bookings');
        toast.error('Failed to fetch bookings');
      }

      // Fetch rooms
      const roomsResponse = await fetch('http://localhost:3001/api/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        console.log('Rooms fetched:', roomsData.rooms?.length || 0);
        setRooms(roomsData.rooms || []);
      }

      // Fetch guests (users with Guest role)
      const usersResponse = await fetch('http://localhost:3001/api/user/users/Guest', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('Guests fetched:', usersData.users?.length || 0);
        setGuests(usersData.users || []);
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

  // Generate 4-digit booking number helper
  const generateBookingNumber = () => String(Math.floor(1000 + Math.random() * 9000));

  // Handle form submission
  const handleSubmit = async (data) => {
    setLoading(true);
    console.log('Submitting booking data:', data);

    try {
      const url = modal.mode === 'edit' && modal.data
        ? `http://localhost:3001/api/bookings/${modal.data._id}`
        : 'http://localhost:3001/api/bookings';
      
      const method = modal.mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          bookingNumber: data.bookingNumber || generateBookingNumber(),
          totalAmount: data.totalAmount ?? formData.totalAmount ?? 0
        })
      });

      if (response.ok) {
        toast.success(modal.mode === 'edit' ? 'Booking updated successfully' : 'Booking created successfully');
        closeModal();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save booking');
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      toast.error('Error saving booking');
    } finally {
      setLoading(false);
    }
  };

  // Handle booking status update
  const handleStatusUpdate = async (bookingId, action) => {
    try {
      console.log(`Updating booking ${bookingId} with action: ${action}`);

      const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success(`Booking ${action} successful`);
        fetchData();
      } else {
        toast.error(`Failed to ${action} booking`);
      }
    } catch (error) {
      console.error(`Error ${action} booking:`, error);
      toast.error(`Error ${action} booking`);
    }
  };

  const handleDeleteReservation = async (bookingId) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "You will not be able to recover this reservation!",
      icon: "warning",
      buttons: ["No, keep it", "Yes, delete it!"], // old sweetalert
      dangerMode: true,
    });

    if (willDelete) {
      try {
        const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          swal("Deleted!", "Your reservation has been deleted.", "success");
          fetchData();
        } else {
          const err = await response.json().catch(() => ({}));
          swal("Failed!", err.message || "Failed to delete reservation", "error");
        }
      } catch (e) {
        console.error("Delete reservation error:", e);
        swal("Error!", "Something went wrong while deleting.", "error");
      }
    } else {
      swal("Cancelled", "Your reservation is safe!", "info");
    }
  };

  // Handle edit booking
  const handleEdit = (booking) => {
    console.log('Editing booking:', booking);
    openModal('edit', booking);
  };

  // Calculate nights
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Auto compute totalAmount when room or dates change
  useEffect(() => {
    const selectedRoom = rooms.find(r => r._id === formData.room);
    const nights = calculateNights(formData.checkInDate, formData.checkOutDate);
    if (selectedRoom && nights > 0) {
      const total = (selectedRoom.pricePerNight || 0) * nights;
      setFormData(prev => ({ ...prev, totalAmount: total }));
    }
  }, [formData.room, formData.checkInDate, formData.checkOutDate, rooms]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
    const matchesSearch = !filters.search || 
        booking.bookingNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
        booking.guest?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        booking.room?.roomNumber?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || booking.status === filters.status;
    const matchesPaymentStatus = !filters.paymentStatus || booking.paymentStatus === filters.paymentStatus;
    
    const matchesCheckIn = !filters.checkInDate || 
      new Date(booking.checkInDate).toISOString().split('T')[0] === filters.checkInDate;
    
    const matchesCheckOut = !filters.checkOutDate || 
      new Date(booking.checkOutDate).toISOString().split('T')[0] === filters.checkOutDate;

    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesCheckIn && matchesCheckOut;
  });
  }, [bookings, filters]);

  // Sort bookings
  const sortedBookings = useMemo(() => {
    if (!sortConfig.key) return filteredBookings;

    return [...filteredBookings].sort((a, b) => {
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
  }, [filteredBookings, sortConfig]);

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
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedBookings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      paymentStatus: '',
      checkInDate: '',
      checkOutDate: ''
    });
    setCurrentPage(1);
  };

  // Get booking statistics
  const bookingStats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    checkedIn: bookings.filter(b => b.status === 'Checked In').length,
    checkedOut: bookings.filter(b => b.status === 'Checked Out').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length
  }), [bookings]);

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
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Calendar className="h-8 w-8 text-indigo-600" />
                </div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
              </div>
              <p className="text-gray-600">Manage guest reservations, check-ins, and check-outs efficiently</p>
        </div>
            <div className="flex-shrink-0">
        <button
          onClick={() => {
                  openModal('add');
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
          New Booking
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
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats.total}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{bookingStats.pending}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{bookingStats.confirmed}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checked In</p>
                <p className="text-2xl font-bold text-green-600">{bookingStats.checkedIn}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checked Out</p>
                <p className="text-2xl font-bold text-gray-600">{bookingStats.checkedOut}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{bookingStats.cancelled}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Filter Bookings</h2>
            <p className="text-sm text-gray-600">Use filters to find specific bookings quickly</p>
      </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search bookings..."
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
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No Show">No Show</option>
            </select>
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              value={filters.paymentStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
            >
              <option value="">All Payment Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
            <input
              type="date"
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              value={filters.checkInDate}
              onChange={(e) => setFilters(prev => ({ ...prev, checkInDate: e.target.value }))}
            />
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
            <input
              type="date"
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              value={filters.checkOutDate}
              onChange={(e) => setFilters(prev => ({ ...prev, checkOutDate: e.target.value }))}
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

      {/* Bookings Table */}
      {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          </div>
        ) : sortedBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {bookings.length === 0
                ? "Get started by creating your first booking."
                : "Try adjusting your filters or search terms."
              }
            </p>
            <button
              onClick={() => openModal('add')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors gap-2"
            >
              <Plus size={16} />
              New Booking
            </button>
        </div>
      ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Bookings List</h3>
                <p className="text-sm text-gray-600">
                  Showing {paginatedBookings.length} of {sortedBookings.length} bookings
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
                      onClick={() => handleSort('bookingNumber')}
                    >
                      <div className="flex items-center gap-2">
                        Booking #
                        <SortIcon column="bookingNumber" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('guest.name')}
                    >
                      <div className="flex items-center gap-2">
                        Guest
                        <SortIcon column="guest.name" />
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
                      onClick={() => handleSort('checkInDate')}
                    >
                      <div className="flex items-center gap-2">
                        Check-in
                        <SortIcon column="checkInDate" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('checkOutDate')}
                    >
                      <div className="flex items-center gap-2">
                        Check-out
                        <SortIcon column="checkOutDate" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('numberOfGuests')}
                    >
                      <div className="flex items-center gap-2">
                        Guests
                        <SortIcon column="numberOfGuests" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('totalAmount')}
                    >
                      <div className="flex items-center gap-2">
                        Amount
                        <SortIcon column="totalAmount" />
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
                      onClick={() => handleSort('paymentStatus')}
                    >
                      <div className="flex items-center gap-2">
                        Payment
                        <SortIcon column="paymentStatus" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                </tr>
              </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedBookings.map((booking) => {
                    const statusInfo = statusConfig[booking.status];
                    const paymentInfo = paymentStatusConfig[booking.paymentStatus];
                    const StatusIcon = statusInfo?.icon || Clock;
                    const PaymentIcon = paymentInfo?.icon || Clock;
                    const nights = calculateNights(booking.checkInDate, booking.checkOutDate);

                    return (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-semibold text-gray-900">
                        {booking.bookingNumber}
                      </div>
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-indigo-600">
                                  {booking.guest?.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.guest?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.guest?.email}
                              </div>
                            </div>
                      </div>
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                        <div className="font-medium">Room {booking.room?.roomNumber}</div>
                            <div className="text-gray-500">{booking.room?.roomType}</div>
                      </div>
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'}
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'}
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {nights} day{nights !== 1 ? 's' : ''}
                          </span>
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <User size={16} className="text-gray-400 mr-2" />
                        {booking.numberOfGuests}
                      </div>
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          <div className="max-w-[120px] overflow-hidden text-ellipsis truncate">Rs:{booking.totalAmount?.toLocaleString() || '0'}</div>
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                            <StatusIcon size={12} />
                        {booking.status}
                      </span>
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${paymentInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                            <PaymentIcon size={12} />
                        {booking.paymentStatus}
                      </span>
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(booking)}
                              className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-1 rounded"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        
                        {booking.status === 'Confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'checkin')}
                                className="text-green-600 hover:text-green-900 hover:bg-green-50 p-1 rounded"
                            title="Check In"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        
                        {booking.status === 'Checked In' && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'checkout')}
                                className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded"
                            title="Check Out"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        
                        {!['Checked Out', 'Cancelled'].includes(booking.status) && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'cancel')}
                                className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded"
                            title="Cancel"
                          >
                            <XCircle size={16} />
                          </button>
                        )}

                            <button
                              onClick={() => handleDeleteReservation(booking._id)}
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
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedBookings.length)} of {sortedBookings.length} results
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
                              ? 'bg-indigo-600 text-white border-indigo-600'
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

        {/* Add/Edit Booking Modal */}
        {modal.show && (
          <Modal
            title={modal.mode === 'edit' ? 'Edit Booking' : 'Create New Booking'}
            subtitle={modal.mode === 'edit' ? 'Update booking details' : 'Create a new booking for a guest'}
            mode={modal.mode}
            data={modal.data ? {
              guest: modal.data.guest?._id,
              room: modal.data.room?._id,
              checkInDate: modal.data.checkInDate ? new Date(modal.data.checkInDate).toISOString().split('T')[0] : '',
              checkOutDate: modal.data.checkOutDate ? new Date(modal.data.checkOutDate).toISOString().split('T')[0] : '',
              numberOfGuests: modal.data.numberOfGuests,
              paymentMode: modal.data.paymentMode || '',
              totalAmount: modal.data.totalAmount ?? '',
              paymentStatus: modal.data.paymentStatus || 'Pending'
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

export default BookingManagement;
