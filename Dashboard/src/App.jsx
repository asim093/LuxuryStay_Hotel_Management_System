import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DashboardLayout from './components/Layout/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import StaffManagement from './pages/Staff/StaffManagement';
import RoomManagement from './pages/Rooms/RoomManagement';
import BookingManagement from './pages/Bookings/BookingManagement';
import PlaceholderModule from './components/Placeholder/PlaceholderModule';
import { initializeSampleData } from './utils/sampleData';
import {
  Hotel,
  Calendar,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import { removeUser } from './store/features/user-slice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllUsers from './pages/AllUsers/AllUsers';
import Managers from './pages/Managers/Managers';
import HouseKeeping from './pages/HouseKeeping/HouseKeeping';
import Receptionist from './pages/Receptionist/Receptionist';
import Maintenance from './pages/Maintenance/Maintenance';
import BillingManagement from './pages/Billing/BillingManagement.jsx';
import Settings from './pages/Settings/Settings.jsx';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isLogin);
  const role = useSelector((state) => state?.user?.data?.user?.role);

  useEffect(() => {
    initializeSampleData();
    console.log("role", role);

    // Check for existing token on app startup
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      // You could add token validation here if needed
      // For now, we'll just check if token exists
      console.log('Token found in localStorage');
    }
  }, []);

  const handleLogout = () => {
    dispatch(removeUser());
  };

  // Role-based access control configuration
  const rolePermissions = {
    Admin: [
      '/dashboard', '/allUsers', '/manager', '/housekeeping', 
      '/receptionist', '/maintenance', '/billing', '/settings',
      '/staff', '/rooms', '/reservations', '/reports'
    ],
    Manager: [
      '/dashboard', '/staff', '/rooms', '/reservations', 
      '/billing', '/reports', '/settings'
    ],
    Staff: [
      '/dashboard', '/rooms', '/reservations'
    ],
    Receptionist: [
      '/dashboard', '/rooms', '/reservations', '/billing'
    ],
    Maintenance: [
      '/dashboard', '/rooms', '/maintenance'
    ],
    Housekeeping: [
      '/dashboard', '/rooms', '/housekeeping'
    ]
  };

  // Check if user has access to a specific route
  const hasAccess = (path) => {
    if (!role) return false;
    if (role === 'Guest') return false; // Guest role excluded
    
    const allowedPaths = rolePermissions[role] || [];
    return allowedPaths.includes(path);
  };

  // Protected Route Component with role-based access
  const ProtectedRoute = ({ children, requiredPath }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (!hasAccess(requiredPath)) {
      // Redirect to dashboard if no access, or show unauthorized message
      toast.error('You do not have permission to access this page');
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  // Simple Protected Route for basic authentication check
  const BasicProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ?
              <Navigate to="/dashboard" replace /> :
              <Login />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ?
              <Navigate to="/dashboard" replace /> :
              <Signup />
          }
        />

        {/* Dashboard - accessible to all authenticated users except Guest */}
        <Route
          path="/dashboard"
          element={
            <BasicProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <DashboardHome />
              </DashboardLayout>
            </BasicProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/allUsers"
          element={
            <ProtectedRoute requiredPath="/allUsers">
              <DashboardLayout onLogout={handleLogout}>
                <AllUsers />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute requiredPath="/manager">
              <DashboardLayout onLogout={handleLogout}>
                <Managers />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Role-specific management pages */}
        <Route
          path="/housekeeping"
          element={
            <ProtectedRoute requiredPath="/housekeeping">
              <DashboardLayout onLogout={handleLogout}>
                <HouseKeeping />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist"
          element={
            <ProtectedRoute requiredPath="/receptionist">
              <DashboardLayout onLogout={handleLogout}>
                <Receptionist />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute requiredPath="/maintenance">
              <DashboardLayout onLogout={handleLogout}>
                <Maintenance />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Billing - accessible to Admin, Manager, Receptionist */}
        <Route
          path="/billing"
          element={
            <ProtectedRoute requiredPath="/billing">
              <DashboardLayout onLogout={handleLogout}>
                <BillingManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Settings - accessible to Admin and Manager */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredPath="/settings">
              <DashboardLayout onLogout={handleLogout}>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Staff Management - accessible to Admin and Manager */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute requiredPath="/staff">
              <DashboardLayout onLogout={handleLogout}>
                <StaffManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Room Management - accessible to most roles */}
        <Route
          path="/rooms"
          element={
            <ProtectedRoute requiredPath="/rooms">
              <DashboardLayout onLogout={handleLogout}>
                <RoomManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Reservations - accessible to most roles */}
        <Route
          path="/reservations"
          element={
            <ProtectedRoute requiredPath="/reservations">
              <DashboardLayout onLogout={handleLogout}>
                <BookingManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Reports - accessible to Admin and Manager */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute requiredPath="/reports">
              <DashboardLayout onLogout={handleLogout}>
                <PlaceholderModule title="Reports" />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;