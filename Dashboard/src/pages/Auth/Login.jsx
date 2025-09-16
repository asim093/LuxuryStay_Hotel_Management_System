import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useDispatch } from 'react-redux';
import useCallpostApi from '../../Hooks/useCallpostApi';
import { addUser } from '../../store/features/user-slice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ForgotPasswordModal from '../../components/Auth/ForgotPasswordModal';

const Login = ({ onSwitchToSignup }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const { response, loading, error, ApiCall } = useCallpostApi();

  const getRoleBasedRoute = (userRole) => {
    const roleRoutes = {
      Admin: '/dashboard',
      Manager: '/dashboard',
      Staff: '/dashboard',
      Receptionist: '/checkin-checkout',
      Maintenance: '/maintenance-dashboard',
      Housekeeping: '/HouseKeepingDashboard',
      Guest: '/my-reservations'
    };

    return roleRoutes[userRole] || '/dashboard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await ApiCall({
      url: "/api/user/Login",
      method: "POST",
      body: formData
    });
  };

  useEffect(() => {
    if (response) {
      console.log('Login response:', response);

      let userData = null;

      if (response.user) {
        userData = response.user;
      } else if (response.data) {
        userData = response.data.user;
      } else if (response.data?.data?.user) {
        userData = response.data.data.user;
      }

      if (userData && userData.token) {
        console.log('Token received:', userData.token.substring(0, 20) + '...');
        console.log('User role:', userData.role);

        dispatch(addUser(response));

        toast.success(`Welcome back, ${userData.name || 'User'}!`);

        const targetRoute = getRoleBasedRoute(userData.role);
        console.log('Navigating to:', targetRoute);

        setTimeout(() => {
          navigate(targetRoute);
        }, 100);
      } else {
        console.error('No token in response:', response);
        toast.error('Login failed - invalid response');
      }
    }
  }, [response, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      console.error('Login error:', error);
      toast.error("Invalid credentials");
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">LS</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your LuxuryStay Dashboard
          </p>
        </div>

        <div className="card bg-white shadow-xl">
          <form className="space-y-6 p-8" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="label cursor-pointer">
                <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                <span className="label-text ml-2">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm">Loading...</span>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </div>
  );
};

export default Login;