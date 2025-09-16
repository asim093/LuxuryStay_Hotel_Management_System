import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Hotel,
  Calendar,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  Search,
  ChevronDown,
  Cog,
  Shield,
  User2,
  Wrench,
  Bed,
  ClipboardList,
  UserCheck
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { removeUser } from '../../store/features/user-slice';

const DashboardLayout = ({ children, onLogout }) => {
  // Try different possible selector paths with fallback
  const userState = useSelector((state) => state.user);
  const user = useSelector((state) => {
    // Try different possible paths where user data might be stored
    if (state.user?.data?.user) return state.user.data.user;
    if (state.user?.data?.data?.user) return state.user.data.data.user;
    if (state.user?.user) return state.user.user;
    if (state.user) return state.user;
    return null;
  });

  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState({});
  const location = useLocation();

  // Debug user state (remove this after fixing)
  console.log('User State:', userState);
  console.log('User:', user);

  // Role-based navigation configuration
  const getNavigationByRole = (userRole) => {
    const baseNavigation = {
      Admin: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Users', icon: User2, href: '/allUsers' },
        {
          name: 'Staff Management',
          icon: Users,
          subMenu: [
            { name: 'All Staff', href: '/staff' },
            { name: 'Managers', href: '/manager' },
            { name: 'Receptionists', href: '/receptionist' },
            { name: 'Housekeeping', href: '/housekeeping' },
            { name: 'Maintenance', href: '/maintenance' },
          ],
        },
        { name: 'Room Management', icon: Hotel, href: '/rooms' },
        { name: 'Reservations', icon: Calendar, href: '/reservations' },
        { name: 'Billing', icon: CreditCard, href: '/billing' },
        { name: 'Reports', icon: BarChart3, href: '/reports' },
        { name: 'Settings', icon: Settings, href: '/settings' },
      ],

      Manager: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        {
          name: 'Staff Management',
          icon: Users,
          subMenu: [
            { name: 'All Staff', href: '/staff' },
            { name: 'Receptionists', href: '/receptionist' },
            { name: 'Housekeeping', href: '/housekeeping' },
            { name: 'Maintenance', href: '/maintenance' },
          ],
        },
        { name: 'Room Management', icon: Hotel, href: '/rooms' },
        { name: 'Reservations', icon: Calendar, href: '/reservations' },
        { name: 'Billing', icon: CreditCard, href: '/billing' },
        { name: 'Reports', icon: BarChart3, href: '/reports' },
        { name: 'Settings', icon: Settings, href: '/settings' },
      ],

      Staff: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'My Tasks', icon: ClipboardList, href: '/my-tasks' },
        { name: 'Reservations', icon: Calendar, href: '/reservations' },
        { name: 'Room Status', icon: Hotel, href: '/room-status' },
      ],

      Receptionist: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/reception-dashboard' },
        { name: 'Check In/Out', icon: UserCheck, href: '/checkin-checkout' },
        { name: 'Reservations', icon: Calendar, href: '/reservations' },
        { name: 'Billing', icon: CreditCard, href: '/billing' },
      ],

      Maintenance: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/maintenance-dashboard' },
        { name: 'Tasks Page', icon: Wrench, href: '/task-page' },
        { name: 'Task History', icon: Hotel, href: '/task-history' },
      ],

      Housekeeping: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/HouseKeepingDashboard' },
        { name: 'Cleaning Tasks', icon: ClipboardList, href: '/cleaning-tasks' },
        { name: 'Cleaning Room', icon: Hotel, href: '/cleaning-room' },
      ],

      Guest: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'My Reservations', icon: Calendar, href: '/my-reservations' },
        { name: 'Services', icon: Settings, href: '/guest-services' },
        { name: 'Billing', icon: CreditCard, href: '/my-billing' },
        { name: 'Profile', icon: User, href: '/profile' },
      ],
    };

    return baseNavigation[userRole] || baseNavigation.Guest;
  };

  // Get navigation based on user role with fallback
  const userRole = user?.role || 'Guest';
  const navigation = getNavigationByRole(userRole);

  const handleLogout = () => {
    toast.success('Logout successful');
    setTimeout(() => {
      dispatch(removeUser());
      if (onLogout) {
        onLogout();
      }
    }, 1500);
  };

  const isActiveRoute = (href) => location.pathname === href;

  const toggleSubmenu = (name) => {
    setSubmenuOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const getRoleColorScheme = (role) => {
    const colorSchemes = {
      Admin: 'from-red-600 to-red-700',
      Manager: 'from-blue-600 to-indigo-600',
      Staff: 'from-green-600 to-green-700',
      Receptionist: 'from-purple-600 to-purple-700',
      Maintenance: 'from-orange-600 to-orange-700',
      Housekeeping: 'from-pink-600 to-pink-700',
      Guest: 'from-gray-600 to-gray-700',
    };
    return colorSchemes[role] || colorSchemes.Guest;
  };

  const roleColorScheme = getRoleColorScheme(userRole);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 bg-gradient-to-r ${roleColorScheme} rounded-lg flex items-center justify-center`}>
              <span className="text-lg font-bold text-white">LS</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">LuxuryStay</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>


        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400" style={{ maxHeight: 'calc(100vh - 100px)' }}>
          <div className="space-y-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {/* Main Menu Item */}
                {!item.subMenu ? (
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActiveRoute(item.href)
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <item.icon size={20} className="mr-3" />
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActiveRoute(item.href)
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <item.icon size={20} className="mr-3" />
                    {item.name}
                    <ChevronDown
                      size={16}
                      className={`ml-auto transition-transform duration-200 ${submenuOpen[item.name] ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                )}

                {/* Sub-menu - Only show if user has access to submenu items */}
                {item.subMenu && submenuOpen[item.name] && (
                  <div className="pl-6 mt-2 mb-2 space-y-1 border-l-2 border-gray-200 ml-6">
                    {item.subMenu.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${isActiveRoute(sub.href)
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Extra padding at bottom to ensure last item is fully visible */}
            <div className="h-4"></div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {user?.profileImage ? (
                <img
                  src={user?.profileImage}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User size={20} className="text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userRole}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 ">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center justify-between w-full space-x-4">
              {/* Search - Hidden for Guest role */}
              {userRole !== 'Guest' && (
                <div className="relative hidden md:block">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
              )}

              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {user?.profileImage ? (
                        <img
                          src={user?.profileImage}
                          alt="User"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User size={16} className="text-blue-600" />
                      )}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.name || 'User'}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>

                  {profileDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.email || 'user@luxurystay.com'}
                          </p>
                          <p className="text-xs text-blue-600 font-medium mt-1">
                            {userRole}
                          </p>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <User size={16} className="mr-3 text-gray-400" />
                            Profile
                          </Link>
                    
                        </div>

                        <div className="border-t border-gray-200 py-1">
                          <button
                            onClick={() => {
                              handleLogout();
                              setProfileDropdownOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={16} className="mr-3" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;