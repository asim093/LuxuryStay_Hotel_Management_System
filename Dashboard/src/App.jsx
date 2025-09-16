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


function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isLogin);

  useEffect(() => {
    initializeSampleData();

    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      console.log('Token found in localStorage');
    }
  }, []);

  const handleLogout = () => {
    dispatch(removeUser());
  };

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
          path="/allUsers"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <AllUsers />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <Managers />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/housekeeping"
          element={
            <ProtectedRoute>
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
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <Receptionist />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <Maintenance />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <BillingManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <Settings />
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
                <RoomManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <BookingManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
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