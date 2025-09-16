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
    KeyRound,
    Phone,
    Mail,
    Trash2,
    AlertCircle,
    ChevronUp,
    ChevronDown,
    ArrowUpDown,
    LogIn,
    LogOut,
    Timer,
    Star,
    CreditCard,
    Luggage,
    MapPin,
    Users,
    Car,
    Wifi,
    Coffee,
    Shield
} from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '../../../components/Modal/Modal';
import swal from 'sweetalert';

const CheckInCheckOutManagement = () => {
    const token = useSelector((state) => state.user.token);
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ show: false, mode: null, data: null });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [activeTab, setActiveTab] = useState('arrivals');
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        roomType: '',
        checkInDate: '',
        checkOutDate: '',
        paymentStatus: ''
    });

    const [formData, setFormData] = useState({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        guestAddress: '',
        guestIdType: 'Passport',
        guestIdNumber: '',
        room: '',
        checkInDate: '',
        checkInTime: '',
        checkOutDate: '',
        checkOutTime: '',
        numberOfGuests: 1,
        specialRequests: '',
        paymentMethod: 'Cash',
        totalAmount: 0,
        advancePayment: 0,
        vehicleNumber: '',
        emergencyContact: '',
        emergencyPhone: ''
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
                name: 'guestName',
                label: 'Guest Name',
                type: 'text',
                required: true,
                inputProps: { placeholder: 'Enter guest full name' }
            },
            {
                name: 'guestEmail',
                label: 'Email Address',
                type: 'email',
                required: true,
                inputProps: { placeholder: 'guest@email.com' }
            },
            {
                name: 'guestPhone',
                label: 'Phone Number',
                type: 'tel',
                required: true,
                inputProps: { placeholder: '+92-300-1234567' }
            },
            {
                name: 'guestAddress',
                label: 'Address',
                type: 'textarea',
                required: true,
                inputProps: { rows: 2, placeholder: 'Complete address' }
            },
            {
                name: 'guestIdType',
                label: 'ID Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'Passport', label: 'Passport' },
                    { value: 'CNIC', label: 'CNIC' },
                    { value: 'Driving License', label: 'Driving License' },
                    { value: 'Other', label: 'Other' }
                ]
            },
            {
                name: 'guestIdNumber',
                label: 'ID Number',
                type: 'text',
                required: true,
                inputProps: { placeholder: 'Enter ID number' }
            },
            {
                name: 'room',
                label: 'Room',
                type: 'select',
                required: true,
                options: rooms.filter(r => r.status === 'Available').map(r => ({
                    value: r._id,
                    label: `Room ${r.roomNumber} - ${r.roomType} (${r.pricePerNight}/night)`
                }))
            },
            {
                name: 'checkInDate',
                label: 'Check-In Date',
                type: 'date',
                required: true,
                inputProps: { min: minDate }
            },
            {
                name: 'checkInTime',
                label: 'Check-In Time',
                type: 'time',
                required: true,
                inputProps: { defaultValue: '14:00' }
            },
            {
                name: 'checkOutDate',
                label: 'Check-Out Date',
                type: 'date',
                required: true,
                inputProps: { min: minDate }
            },
            {
                name: 'checkOutTime',
                label: 'Check-Out Time',
                type: 'time',
                required: true,
                inputProps: { defaultValue: '12:00' }
            },
            {
                name: 'numberOfGuests',
                label: 'Number of Guests',
                type: 'number',
                required: true,
                inputProps: { min: 1, max: 6 }
            },
            {
                name: 'paymentMethod',
                label: 'Payment Method',
                type: 'select',
                required: true,
                options: [
                    { value: 'Cash', label: 'Cash' },
                    { value: 'Credit Card', label: 'Credit Card' },
                    { value: 'Debit Card', label: 'Debit Card' },
                    { value: 'Bank Transfer', label: 'Bank Transfer' },
                    { value: 'Mobile Payment', label: 'Mobile Payment' }
                ]
            },
            {
                name: 'totalAmount',
                label: 'Total Amount (PKR)',
                type: 'number',
                required: true,
                inputProps: { min: 0, step: 100 }
            },
            {
                name: 'advancePayment',
                label: 'Advance Payment (PKR)',
                type: 'number',
                required: false,
                inputProps: { min: 0, step: 100 }
            },
            {
                name: 'vehicleNumber',
                label: 'Vehicle Number',
                type: 'text',
                required: false,
                inputProps: { placeholder: 'ABC-123 (Optional)' }
            },
            {
                name: 'emergencyContact',
                label: 'Emergency Contact Name',
                type: 'text',
                required: false,
                inputProps: { placeholder: 'Emergency contact person' }
            },
            {
                name: 'emergencyPhone',
                label: 'Emergency Contact Phone',
                type: 'tel',
                required: false,
                inputProps: { placeholder: '+92-300-1234567' }
            },
            {
                name: 'specialRequests',
                label: 'Special Requests',
                type: 'textarea',
                required: false,
                inputProps: { rows: 3, placeholder: 'Any special requests or notes...' }
            }
        ];
    };

    const statusConfig = {
        'Pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
        'Checked In': { color: 'bg-green-100 text-green-800 border-green-200', icon: LogIn },
        'Checked Out': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: LogOut },
        'No Show': { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
        'Cancelled': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle }
    };

    const paymentStatusConfig = {
        'Paid': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
        'Partial': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
        'Pending': { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle }
    };

    // Mock data initialization
    useEffect(() => {
        const initializeMockData = () => {
            setLoading(true);

            // Mock bookings data
            const mockBookings = [
                {
                    _id: '1',
                    bookingNumber: 'BK001',
                    guestName: 'Ahmed Ali',
                    guestEmail: 'ahmed.ali@email.com',
                    guestPhone: '+92-300-1234567',
                    guestAddress: 'House 123, Street 5, Gulshan-e-Iqbal, Karachi',
                    guestIdType: 'CNIC',
                    guestIdNumber: '42101-1234567-1',
                    room: { _id: 'r1', roomNumber: '101', roomType: 'Deluxe', pricePerNight: 8000 },
                    checkInDate: new Date().toISOString(),
                    checkInTime: '14:00',
                    checkOutDate: new Date(Date.now() + 86400000).toISOString(),
                    checkOutTime: '12:00',
                    numberOfGuests: 2,
                    status: 'Pending',
                    paymentMethod: 'Credit Card',
                    totalAmount: 8000,
                    advancePayment: 4000,
                    paymentStatus: 'Partial',
                    vehicleNumber: 'ABC-123',
                    emergencyContact: 'Sara Ali',
                    emergencyPhone: '+92-301-7654321',
                    specialRequests: 'Late check-in requested',
                    createdAt: new Date().toISOString()
                },
                {
                    _id: '2',
                    bookingNumber: 'BK002',
                    guestName: 'Fatima Khan',
                    guestEmail: 'fatima.khan@email.com',
                    guestPhone: '+92-321-9876543',
                    guestAddress: 'Flat 45, Block C, DHA Phase 2, Karachi',
                    guestIdType: 'Passport',
                    guestIdNumber: 'AB1234567',
                    room: { _id: 'r2', roomNumber: '205', roomType: 'Standard', pricePerNight: 5000 },
                    checkInDate: new Date(Date.now() - 86400000).toISOString(),
                    checkInTime: '15:30',
                    checkOutDate: new Date().toISOString(),
                    checkOutTime: '11:00',
                    numberOfGuests: 1,
                    status: 'Checked In',
                    paymentMethod: 'Cash',
                    totalAmount: 5000,
                    advancePayment: 5000,
                    paymentStatus: 'Paid',
                    vehicleNumber: '',
                    emergencyContact: 'Hassan Khan',
                    emergencyPhone: '+92-322-1111111',
                    specialRequests: 'Non-smoking room',
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                }
            ];

            // Mock rooms data
            const mockRooms = [
                { _id: 'r1', roomNumber: '101', roomType: 'Deluxe', status: 'Available', pricePerNight: 8000 },
                { _id: 'r2', roomNumber: '102', roomType: 'Standard', status: 'Available', pricePerNight: 5000 },
                { _id: 'r3', roomNumber: '205', roomType: 'Standard', status: 'Occupied', pricePerNight: 5000 },
                { _id: 'r4', roomNumber: '301', roomType: 'Suite', status: 'Available', pricePerNight: 12000 }
            ];

            setBookings(mockBookings);
            setRooms(mockRooms);
            setLoading(false);
        };

        initializeMockData();
    }, []);

    // Generate booking number helper
    const generateBookingNumber = () => 'BK' + String(Math.floor(1000 + Math.random() * 9000));

    // Handle form submission
    const handleSubmit = async (data) => {
        setLoading(true);
        console.log('Submitting booking data:', data);

        try {
            // Calculate payment status
            const paymentStatus = data.advancePayment >= data.totalAmount ? 'Paid' :
                data.advancePayment > 0 ? 'Partial' : 'Pending';

            const newBooking = {
                _id: Date.now().toString(),
                bookingNumber: generateBookingNumber(),
                ...data,
                room: rooms.find(r => r._id === data.room),
                status: 'Pending',
                paymentStatus,
                createdAt: new Date().toISOString()
            };

            if (modal.mode === 'edit') {
                setBookings(prev => prev.map(b => b._id === modal.data._id ? { ...modal.data, ...data } : b));
                toast.success('Booking updated successfully');
            } else {
                setBookings(prev => [...prev, newBooking]);
                toast.success('Booking created successfully');
            }

            closeModal();
        } catch (error) {
            console.error('Error saving booking:', error);
            toast.error('Error saving booking');
        } finally {
            setLoading(false);
        }
    };

    // Handle check-in
    const handleCheckIn = async (bookingId) => {
        try {
            setBookings(prev => prev.map(b =>
                b._id === bookingId
                    ? { ...b, status: 'Checked In', actualCheckInTime: new Date().toISOString() }
                    : b
            ));
            toast.success('Guest checked in successfully');
        } catch (error) {
            console.error('Error checking in guest:', error);
            toast.error('Error checking in guest');
        }
    };

    // Handle check-out
    const handleCheckOut = async (bookingId) => {
        try {
            setBookings(prev => prev.map(b =>
                b._id === bookingId
                    ? { ...b, status: 'Checked Out', actualCheckOutTime: new Date().toISOString() }
                    : b
            ));
            toast.success('Guest checked out successfully');
        } catch (error) {
            console.error('Error checking out guest:', error);
            toast.error('Error checking out guest');
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        const willDelete = await swal({
            title: "Are you sure?",
            text: "You will not be able to recover this booking!",
            icon: "warning",
            buttons: ["No, keep it", "Yes, delete it!"],
            dangerMode: true,
        });

        if (willDelete) {
            try {
                setBookings(prev => prev.filter(b => b._id !== bookingId));
                swal("Deleted!", "The booking has been deleted.", "success");
            } catch (e) {
                console.error("Delete booking error:", e);
                swal("Error!", "Something went wrong while deleting.", "error");
            }
        } else {
            swal("Cancelled", "Your booking is safe!", "info");
        }
    };

    // Handle edit booking
    const handleEdit = (booking) => {
        console.log('Editing booking:', booking);
        openModal('edit', booking);
    };

    // Filter bookings based on active tab and filters
    const filteredBookings = useMemo(() => {
        let filtered = bookings;

        // Filter by tab
        if (activeTab === 'arrivals') {
            filtered = filtered.filter(b =>
                b.status === 'Pending' ||
                (new Date(b.checkInDate).toDateString() === new Date().toDateString())
            );
        } else if (activeTab === 'departures') {
            filtered = filtered.filter(b =>
                b.status === 'Checked In' ||
                (new Date(b.checkOutDate).toDateString() === new Date().toDateString())
            );
        } else if (activeTab === 'current') {
            filtered = filtered.filter(b => b.status === 'Checked In');
        }

        // Apply other filters
        return filtered.filter(booking => {
            const matchesSearch = !filters.search ||
                booking.bookingNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
                booking.guestName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                booking.guestPhone?.includes(filters.search) ||
                booking.room?.roomNumber?.toLowerCase().includes(filters.search.toLowerCase());

            const matchesStatus = !filters.status || booking.status === filters.status;
            const matchesRoomType = !filters.roomType || booking.room?.roomType === filters.roomType;
            const matchesPaymentStatus = !filters.paymentStatus || booking.paymentStatus === filters.paymentStatus;

            const matchesCheckIn = !filters.checkInDate ||
                new Date(booking.checkInDate).toISOString().split('T')[0] === filters.checkInDate;
            const matchesCheckOut = !filters.checkOutDate ||
                new Date(booking.checkOutDate).toISOString().split('T')[0] === filters.checkOutDate;

            return matchesSearch && matchesStatus && matchesRoomType && matchesPaymentStatus &&
                matchesCheckIn && matchesCheckOut;
        });
    }, [bookings, activeTab, filters]);

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
            roomType: '',
            checkInDate: '',
            checkOutDate: '',
            paymentStatus: ''
        });
        setCurrentPage(1);
    };

    // Get booking statistics
    const bookingStats = useMemo(() => ({
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'Pending').length,
        checkedIn: bookings.filter(b => b.status === 'Checked In').length,
        checkedOut: bookings.filter(b => b.status === 'Checked Out').length,
        arrivals: bookings.filter(b =>
            new Date(b.checkInDate).toDateString() === new Date().toDateString()
        ).length,
        departures: bookings.filter(b =>
            new Date(b.checkOutDate).toDateString() === new Date().toDateString()
        ).length,
        revenue: bookings.filter(b => b.paymentStatus === 'Paid')
            .reduce((sum, b) => sum + b.totalAmount, 0)
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
                                    <KeyRound className="h-8 w-8 text-indigo-600" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900">Check-In & Check-Out</h1>
                            </div>
                            <p className="text-gray-600">Manage guest arrivals, departures, and room assignments efficiently</p>
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                onClick={() => openModal('add')}
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{bookingStats.total}</p>
                            </div>
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Bed className="h-5 w-5 text-gray-600" />
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
                                <p className="text-sm font-medium text-gray-600">Checked In</p>
                                <p className="text-2xl font-bold text-green-600">{bookingStats.checkedIn}</p>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <LogIn className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Checked Out</p>
                                <p className="text-2xl font-bold text-blue-600">{bookingStats.checkedOut}</p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <LogOut className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Today Arrivals</p>
                                <p className="text-2xl font-bold text-purple-600">{bookingStats.arrivals}</p>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Luggage className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Today Departures</p>
                                <p className="text-2xl font-bold text-orange-600">{bookingStats.departures}</p>
                            </div>
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Car className="h-5 w-5 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Revenue</p>
                                <p className="text-2xl font-bold text-emerald-600">₨{bookingStats.revenue.toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <CreditCard className="h-5 w-5 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {[
                                { id: 'arrivals', name: 'Today Arrivals', icon: LogIn, count: bookingStats.arrivals },
                                { id: 'departures', name: 'Today Departures', icon: LogOut, count: bookingStats.departures },
                                { id: 'current', name: 'Current Guests', icon: Users, count: bookingStats.checkedIn },
                                { id: 'all', name: 'All Bookings', icon: Bed, count: bookingStats.total }
                            ].map((tab) => {
                                const TabIcon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`${activeTab === tab.id
                                                ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            } whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm rounded-t-lg flex items-center gap-2`}
                                    >
                                        <TabIcon size={16} />
                                        {tab.name}
                                        <span className={`${activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                                            } ml-2 py-0.5 px-2 rounded-full text-xs font-medium`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Filters Section */}
                    <div className="p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Filter Bookings</h3>
                            <p className="text-sm text-gray-600">Use filters to find specific bookings quickly</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
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
                                    <option value="Checked In">Checked In</option>
                                    <option value="Checked Out">Checked Out</option>
                                    <option value="No Show">No Show</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                                <select
                                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    value={filters.roomType}
                                    onChange={(e) => setFilters(prev => ({ ...prev, roomType: e.target.value }))}
                                >
                                    <option value="">All Room Types</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Deluxe">Deluxe</option>
                                    <option value="Suite">Suite</option>
                                    <option value="Executive">Executive</option>
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
                                    <option value="Paid">Paid</option>
                                    <option value="Partial">Partial</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Check-In Date</label>
                                <input
                                    type="date"
                                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    value={filters.checkInDate}
                                    onChange={(e) => setFilters(prev => ({ ...prev, checkInDate: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Check-Out Date</label>
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
                            <KeyRound className="mx-auto h-12 w-12 text-gray-400 mb-4" />
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
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {activeTab === 'arrivals' && 'Today Arrivals'}
                                        {activeTab === 'departures' && 'Today Departures'}
                                        {activeTab === 'current' && 'Current Guests'}
                                        {activeTab === 'all' && 'All Bookings'}
                                    </h3>
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
                                                onClick={() => handleSort('guestName')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Guest Details
                                                    <SortIcon column="guestName" />
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
                                                    Check-In
                                                    <SortIcon column="checkInDate" />
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('checkOutDate')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Check-Out
                                                    <SortIcon column="checkOutDate" />
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                                            const PaymentIcon = paymentInfo?.icon || AlertCircle;

                                            return (
                                                <tr key={booking._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-mono font-semibold text-gray-900">
                                                            {booking.bookingNumber}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(booking.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                    <User size={16} className="text-indigo-600" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {booking.guestName}
                                                                </div>
                                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                                    <Phone size={12} />
                                                                    {booking.guestPhone}
                                                                </div>
                                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                                    <Mail size={12} />
                                                                    {booking.guestEmail}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                                                    <Bed size={16} className="text-purple-600" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    Room {booking.room?.roomNumber}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {booking.room?.roomType}
                                                                </div>
                                                                <div className="text-xs text-gray-400">
                                                                    ₨{booking.room?.pricePerNight}/night
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <div className="flex items-center gap-1 text-sm font-medium">
                                                            <Calendar size={12} />
                                                            {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {booking.checkInTime || 'No time set'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <div className="flex items-center gap-1 text-sm font-medium">
                                                            <Calendar size={12} />
                                                            {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {booking.checkOutTime || 'No time set'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            <Users size={12} className="mr-1" />
                                                            {booking.numberOfGuests}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            ₨{booking.totalAmount?.toLocaleString()}
                                                        </div>
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${paymentInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                                                            <PaymentIcon size={10} />
                                                            {booking.paymentStatus}
                                                        </span>
                                                        {booking.advancePayment > 0 && (
                                                            <div className="text-xs text-gray-500">
                                                                Advance: ₨{booking.advancePayment?.toLocaleString()}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                                                            <StatusIcon size={12} />
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleEdit(booking)}
                                                                className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-1 rounded"
                                                                title="Edit Booking"
                                                            >
                                                                <Edit size={16} />
                                                            </button>

                                                            {booking.status === 'Pending' && (
                                                                <button
                                                                    onClick={() => handleCheckIn(booking._id)}
                                                                    className="text-green-600 hover:text-green-900 hover:bg-green-50 p-1 rounded"
                                                                    title="Check In"
                                                                >
                                                                    <LogIn size={16} />
                                                                </button>
                                                            )}

                                                            {booking.status === 'Checked In' && (
                                                                <button
                                                                    onClick={() => handleCheckOut(booking._id)}
                                                                    className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded"
                                                                    title="Check Out"
                                                                >
                                                                    <LogOut size={16} />
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() => openModal('view', booking)}
                                                                className="text-purple-600 hover:text-purple-900 hover:bg-purple-50 p-1 rounded"
                                                                title="View Details"
                                                            >
                                                                <Eye size={16} />
                                                            </button>

                                                            <button
                                                                onClick={() => handleDeleteBooking(booking._id)}
                                                                className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded"
                                                                title="Delete Booking"
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

                    {/* Add/Edit/View Booking Modal */}
                    {modal.show && (
                        <Modal
                            title={
                                modal.mode === 'edit' ? 'Edit Booking' :
                                    modal.mode === 'view' ? 'Booking Details' :
                                        'Create New Booking'
                            }
                            subtitle={
                                modal.mode === 'edit' ? 'Update booking information' :
                                    modal.mode === 'view' ? 'View complete booking details' :
                                        'Create a new guest booking'
                            }
                            mode={modal.mode}
                            data={modal.data ? {
                                guestName: modal.data.guestName,
                                guestEmail: modal.data.guestEmail,
                                guestPhone: modal.data.guestPhone,
                                guestAddress: modal.data.guestAddress,
                                guestIdType: modal.data.guestIdType,
                                guestIdNumber: modal.data.guestIdNumber,
                                room: modal.data.room?._id,
                                checkInDate: modal.data.checkInDate ? new Date(modal.data.checkInDate).toISOString().split('T')[0] : '',
                                checkInTime: modal.data.checkInTime || '',
                                checkOutDate: modal.data.checkOutDate ? new Date(modal.data.checkOutDate).toISOString().split('T')[0] : '',
                                checkOutTime: modal.data.checkOutTime || '',
                                numberOfGuests: modal.data.numberOfGuests || 1,
                                paymentMethod: modal.data.paymentMethod || 'Cash',
                                totalAmount: modal.data.totalAmount || 0,
                                advancePayment: modal.data.advancePayment || 0,
                                vehicleNumber: modal.data.vehicleNumber || '',
                                emergencyContact: modal.data.emergencyContact || '',
                                emergencyPhone: modal.data.emergencyPhone || '',
                                specialRequests: modal.data.specialRequests || ''
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
        </div>
    );
};

export default CheckInCheckOutManagement;