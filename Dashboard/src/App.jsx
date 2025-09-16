import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DashboardLayout from "./components/Layout/DashboardLayout"
import DashboardHome from './pages/Admin/Dashboard/DashboardHome'
import AllUsers from "./pages/Admin/AllUsers/AllUsers"
import Managers from './pages/Admin/Managers/Managers'
import HouseKeeping from './pages/Admin/HouseKeeping/HouseKeeping'
import HousekeepingDashboard from './pages/HouseKeeping/HouseKeepingDashboard/HouseKeepingDashboard'
import CleaningTasksManagement from './pages/HouseKeeping/CleaningTask/CleaningTask'
import PlaceholderModule from './components/Placeholder/PlaceholderModule';
import CompletedRoomsManagement from './pages/HouseKeeping/CleanRooms/CleanRooms'
import Receptionist from './pages/Admin/Receptionist/Receptionist'
import Maintenance from './pages/Admin/Maintenance/Maintenance'
import BillingManagement from './pages/Admin/Billing/BillingManagement'
import Settings from './pages/Admin/Settings/Settings'
import StaffManagement from './pages/Admin/Staff/StaffManagement'
import RoomManagement from './pages/Admin/Rooms/RoomManagement'
import BookingManagement from './pages/Admin/Bookings/BookingManagement'
import Notifications from './pages/Notifications/Notifications'


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
import MaintenanceDashboard from './pages/Maintenance/MaintenanceDashboard/MaintenanceDashboard';
import MaintenanceTasksPage from './pages/Maintenance/Taskpage/Taskpage';
import TaskHistoryPage from './pages/Maintenance/Taskhistory/TaskHistory';
import ReceptionistDashboard from './pages/Receptionist/ReceptionisDashboard/ReceptionistDashboard';
// import CheckInCheckOutManagement from './pages/Receptionist/CheckInoutmanagement/Checkincheckout';
import UserProfilePage from './pages/profile/Profile';
import Reports from './pages/Admin/Reports/Reports';


function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isLogin);
  const role = useSelector((state) => state?.user?.data?.user?.role);

  useEffect(() => {
    initializeSampleData();
    console.log("role", role);

    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
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

  const hasAccess = (path) => {
    if (!role) return false;
    if (role === 'Guest') return false;

    const allowedPaths = rolePermissions[role] || [];
    return allowedPaths.includes(path);
  };

  const ProtectedRoute = ({ children, requiredPath }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }



    return children;
  };

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

        <Route
          path="/profile"
          element={
            <BasicProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <UserProfilePage />
              </DashboardLayout>
            </BasicProtectedRoute>
          }
        />

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

        {/* <Route
          path="/checkin-checkout"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <CheckInCheckOutManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        /> */}
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
          path="/maintenance-dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <MaintenanceDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/task-page"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <MaintenanceTasksPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/task-history"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <TaskHistoryPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception-dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <ReceptionistDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/HouseKeepingDashboard" element={
          <ProtectedRoute>
            <DashboardLayout onLogout={handleLogout}>
              <HousekeepingDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/cleaning-tasks" element={
          <ProtectedRoute>
            <DashboardLayout onLogout={handleLogout}>
              <CleaningTasksManagement />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/cleaning-room" element={
          <ProtectedRoute>
            <DashboardLayout onLogout={handleLogout}>
              <CompletedRoomsManagement />
            </DashboardLayout>
          </ProtectedRoute>
        } />
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
                <Reports />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Notifications - accessible to all roles */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <Notifications />
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