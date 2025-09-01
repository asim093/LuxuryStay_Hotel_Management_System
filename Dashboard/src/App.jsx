import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import DashboardLayout from './components/Layout/DashboardLayout';
import DashboardHome from './components/Dashboard/DashboardHome';
import StaffManagement from './components/Staff/StaffManagement';
import PlaceholderModule from './components/Placeholder/PlaceholderModule';
import { initializeSampleData } from './utils/sampleData';
import {
  Hotel,
  Calendar,
  CreditCard,
  BarChart3,
  Settings
} from 'lucide-react';
import { removeUser } from './store/features/user-slice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // CSS import zaroori hai

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isLogin);

  useEffect(() => {
    // Initialize sample data
    initializeSampleData();
  }, []);

  const handleLogout = () => {
    dispatch(removeUser());
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
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

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <StaffManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <PlaceholderModule
                  title="Room Management"
                  description="Manage hotel rooms, room types, availability, and maintenance schedules"
                  icon={Hotel}
                  features={[
                    'Room inventory management',
                    'Room type configuration',
                    'Availability tracking',
                    'Maintenance scheduling',
                    'Room status updates',
                    'Housekeeping assignments'
                  ]}
                />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <PlaceholderModule
                  title="Reservations"
                  description="Handle guest bookings, check-ins, check-outs, and reservation management"
                  icon={Calendar}
                  features={[
                    'Guest booking management',
                    'Check-in/Check-out process',
                    'Reservation calendar view',
                    'Guest information tracking',
                    'Booking confirmations',
                    'Cancellation handling'
                  ]}
                />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <PlaceholderModule
                  title="Billing & Payments"
                  description="Manage invoices, payments, and financial transactions"
                  icon={CreditCard}
                  features={[
                    'Invoice generation',
                    'Payment processing',
                    'Financial reporting',
                    'Tax calculations',
                    'Refund management',
                    'Payment gateway integration'
                  ]}
                />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <PlaceholderModule
                  title="Reports & Analytics"
                  description="Generate comprehensive reports and analyze hotel performance metrics"
                  icon={BarChart3}
                  features={[
                    'Occupancy reports',
                    'Revenue analytics',
                    'Guest satisfaction metrics',
                    'Staff performance reports',
                    'Financial summaries',
                    'Custom report builder'
                  ]}
                />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <PlaceholderModule
                  title="System Settings"
                  description="Configure hotel settings, user preferences, and system parameters"
                  icon={Settings}
                  features={[
                    'Hotel information setup',
                    'User account management',
                    'System preferences',
                    'Notification settings',
                    'Security configurations',
                    'Backup and restore'
                  ]}
                />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* Toast Container - Puri app ke liye ek hi */}
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