"use client"
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Edit3, Trash2, Eye, Building } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const loginState = JSON.parse(localStorage.getItem("authState"));
        if (loginState && loginState.user && loginState.token) {
          setToken(loginState.token);
          setUserId(loginState.user.id);
        } else {
          console.warn("No valid auth state found");
        }
      } catch (error) {
        console.error("Error parsing auth state:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (token && userId) {
      fetchBookings();
    }
  }, [token, userId]);

  const fetchBookings = async () => {
    if (!token || !userId) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/bookings/guest/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched bookings:', data.bookings);
        console.log('Booking statuses:', data.bookings?.map(b => ({ id: b._id, status: b.status })));
        setBookings(data.bookings || []);
      } else {
        console.error('Failed to fetch bookings');
        toast.error('Failed to load bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking || !cancelReason.trim()) {
      toast.warning('Please provide a cancellation reason');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/bookings/${selectedBooking._id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: cancelReason })
      });

      if (response.ok) {
        toast.success('Booking cancelled successfully');
        setShowCancelModal(false);
        setCancelReason('');
        setSelectedBooking(null);
        fetchBookings(); // Refresh bookings
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Error cancelling booking');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'Checked In':
        return <CheckCircle size={20} className="text-blue-600" />;
      case 'Checked Out':
        return <CheckCircle size={20} className="text-gray-600" />;
      case 'Cancelled':
        return <XCircle size={20} className="text-red-600" />;
      case 'Pending':
        return <Clock size={20} className="text-yellow-600" />;
      default:
        return <AlertCircle size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Checked In':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Checked Out':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canCancelBooking = (booking) => {
    return ['Pending', 'Confirmed'].includes(booking.status);
  };

  const canCheckOut = (booking) => {
    console.log('Checking checkout for booking:', booking._id, 'Status:', booking.status);
    return booking.status === 'Checked In';
  };

  const canCheckIn = (booking) => {
    return booking.status === 'Confirmed';
  };

  const handleCheckIn = async (bookingId) => {
    if (!token) {
      toast.error('Please log in to check in');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}/checkin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: 'Guest self check-in' })
      });

      if (response.ok) {
        toast.success('✅ Check-in successful!');
        fetchBookings(); // Refresh bookings
      } else {
        const error = await response.json();
        toast.error('❌ ' + (error.message || 'Failed to check in'));
      }
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error('Error during check-in');
    }
  };

  const handleCheckOut = async (bookingId) => {
    if (!token) {
      toast.error('Please log in to check out');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}/checkout`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: 'Guest self checkout' })
      });

      if (response.ok) {
        toast.success('✅ Checkout successful! Your invoice has been sent to your email address.');
        fetchBookings(); // Refresh bookings
      } else {
        const error = await response.json();
        toast.error('❌ ' + (error.message || 'Failed to checkout'));
      }
    } catch (error) {
      console.error('Error checking out:', error);
      toast.error('Error during checkout');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600 mt-1">View and manage your hotel reservations</p>
            </div>
            <div className="text-sm text-gray-500">
              Total Bookings: {bookings.length}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
            <div className="bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Calendar size={48} className="text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Bookings Found</h3>
            <p className="text-gray-600 mb-8 text-lg">You haven't made any bookings yet. Start your journey with us!</p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Building size={20} className="mr-2" />
              Book a Room Now
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Status Bar */}
                <div className={`h-2 w-full ${
                  booking.status === 'Confirmed' ? 'bg-green-500' : 
                  booking.status === 'Checked In' ? 'bg-blue-500' : 
                  booking.status === 'Checked Out' ? 'bg-gray-500' : 
                  booking.status === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Booking #{booking.bookingNumber || booking._id.slice(-8)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Room Info */}
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Room {booking.room?.roomNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.room?.roomType}
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {calculateNights(booking.checkInDate, booking.checkOutDate)} nights
                          </div>
                        </div>
                      </div>

                      {/* Guests */}
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.numberOfGuests} Guest{booking.numberOfGuests > 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-gray-500">
                            Occupancy
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            ${booking.totalAmount?.toLocaleString() || '0'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Total Amount
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {booking.actualCheckInTime && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-800">
                          <strong>Checked In:</strong> {new Date(booking.actualCheckInTime).toLocaleString()}
                        </div>
                      </div>
                    )}

                    {booking.actualCheckOutTime && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-800">
                          <strong>Checked Out:</strong> {new Date(booking.actualCheckOutTime).toLocaleString()}
                        </div>
                      </div>
                    )}

                    {booking.cancellationReason && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg">
                        <div className="text-sm text-red-800">
                          <strong>Cancellation Reason:</strong> {booking.cancellationReason}
                        </div>
                      </div>
                    )}
                  </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 min-w-[200px]">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-blue-300 rounded-xl text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200"
                      >
                        <Eye size={18} className="mr-2" />
                        View Details
                      </button>
                      
                      {canCheckIn(booking) && (
                        <button
                          onClick={() => handleCheckIn(booking._id)}
                          className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-blue-300 rounded-xl text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200"
                        >
                          <CheckCircle size={18} className="mr-2" />
                          Check In
                        </button>
                      )}

                      {canCheckOut(booking) && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowCheckoutModal(true);
                          }}
                          className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-green-300 rounded-xl text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-400 transition-all duration-200"
                        >
                          <CheckCircle size={18} className="mr-2" />
                          Check Out
                        </button>
                      )}
                      
                      {canCancelBooking(booking) && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowCancelModal(true);
                          }}
                          className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-red-300 rounded-xl text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 transition-all duration-200"
                        >
                          <XCircle size={18} className="mr-2" />
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Checkout Confirmation Modal */}
        {showCheckoutModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="text-center mb-6">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Check Out Confirmation</h3>
                <p className="text-gray-600">
                  Are you ready to check out from Room {selectedBooking.room?.roomNumber}?
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Check-in:</span>
                    <p className="font-medium">{formatDate(selectedBooking.checkInDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Check-out:</span>
                    <p className="font-medium">{formatDate(selectedBooking.checkOutDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Amount:</span>
                    <p className="font-bold text-green-600">₹{selectedBooking.totalAmount}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Nights:</span>
                    <p className="font-medium">{calculateNights(selectedBooking.checkInDate, selectedBooking.checkOutDate)}</p>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  An invoice will be sent to your email after checkout.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCheckoutModal(false);
                    setSelectedBooking(null);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Keep Staying
                </button>
                <button
                  onClick={() => {
                    setShowCheckoutModal(false);
                    handleCheckOut(selectedBooking._id);
                  }}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Check Out Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Booking Modal */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Booking</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to cancel booking #{selectedBooking.bookingNumber || selectedBooking._id.slice(-8)}?
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation Reason
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Please provide a reason for cancellation..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                    setSelectedBooking(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
