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
  User2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { removeUser } from '../../store/features/user-slice';

const DashboardLayout = ({ children, onLogout }) => {
  const user = useSelector((state) => state.user.data.user);
  const role = useSelector((state) => state?.user?.data?.user?.role);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState({});
  const location = useLocation();

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
    if (role === 'Guest') return false;

    const allowedPaths = rolePermissions[role] || [];
    return allowedPaths.includes(path);
  };

  // Filter submenu items based on role permissions
  const filterSubMenu = (subMenuItems) => {
    return subMenuItems.filter(item => hasAccess(item.href));
  };

  // Complete navigation structure
  const allNavigation = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      requiredPermission: '/dashboard'
    },
    {
      name: 'Users',
      icon: User2,
      href: '/allUsers',
      requiredPermission: '/allUsers'
    },
    {
      name: 'Staff Management',
      icon: Users,
      requiredPermission: '/staff',
      subMenu: [
        { name: 'All Staff', href: '/staff', requiredPermission: '/staff' },
        { name: 'Managers', href: '/manager', requiredPermission: '/manager' },
        { name: 'Receptionists', href: '/receptionist', requiredPermission: '/receptionist' },
        { name: 'Housekeeping', href: '/housekeeping', requiredPermission: '/housekeeping' },
        { name: 'Maintenance', href: '/maintenance', requiredPermission: '/maintenance' },
      ],
    },
    {
      name: 'Room Management',
      icon: Hotel,
      href: '/rooms',
      requiredPermission: '/rooms'
    },
    {
      name: 'Reservations',
      icon: Calendar,
      href: '/reservations',
      requiredPermission: '/reservations'
    },
    {
      name: 'Billing',
      icon: CreditCard,
      href: '/billing',
      requiredPermission: '/billing'
    },
    {
      name: 'Reports',
      icon: BarChart3,
      href: '/reports',
      requiredPermission: '/reports'
    },
    {
      name: 'Settings',
      icon: Settings,
      href: '/settings',
      requiredPermission: '/settings'
    },
  ];

  // Filter navigation based on user role
  const getFilteredNavigation = () => {
    return allNavigation.filter(item => {
      // Check if user has access to the main item
      if (item.href && !hasAccess(item.requiredPermission)) {
        return false;
      }

      // For items with submenus, check if user has access to any submenu item
      if (item.subMenu) {
        const accessibleSubItems = filterSubMenu(item.subMenu);
        if (accessibleSubItems.length === 0) {
          return false;
        }
        // Update the submenu to only show accessible items
        item.subMenu = accessibleSubItems;
      }

      return true;
    });
  };

  const navigation = getFilteredNavigation();

  const handleLogout = () => {
    toast.success('Logout successful');
    setTimeout(() => {
      dispatch(removeUser());
      onLogout();
    }, 1500);
  };

  const isActiveRoute = (href) => location.pathname === href;

  const toggleSubmenu = (name) => {
    setSubmenuOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
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

        {/* Role Badge */}
        {/* <div className="px-6 py-3 bg-white border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-600">
                {role || 'User'}
              </span>
              <div className={`w-2 h-2 rounded-full ${role === 'Admin' ? 'bg-green-500' :
                  role === 'Manager' ? 'bg-blue-500' :
                    role === 'Staff' ? 'bg-yellow-500' :
                      role === 'Receptionist' ? 'bg-purple-500' :
                        role === 'Maintenance' ? 'bg-orange-500' :
                          role === 'Housekeeping' ? 'bg-pink-500' :
                            'bg-gray-500'
                }`}></div>
            </div>
          </div>
        </div> */}

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User size={20} className="text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {role || 'Administrator'}
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
                      <User size={16} className="text-blue-600" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.name || 'Admin'}
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
                            {user?.name || 'Admin User'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.email || 'admin@luxurystay.com'}
                          </p>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${role === 'Admin' ? 'bg-green-100 text-green-800' :
                                role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                                  role === 'Staff' ? 'bg-yellow-100 text-yellow-800' :
                                    role === 'Receptionist' ? 'bg-purple-100 text-purple-800' :
                                      role === 'Maintenance' ? 'bg-orange-100 text-orange-800' :
                                        role === 'Housekeeping' ? 'bg-pink-100 text-pink-800' :
                                          'bg-gray-100 text-gray-800'
                              }`}>
                              {role}
                            </span>
                          </div>
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
                          {hasAccess('/settings') && (
                            <Link
                              to="/settings"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setProfileDropdownOpen(false)}
                            >
                              <Cog size={16} className="mr-3 text-gray-400" />
                              Settings
                            </Link>
                          )}
                          <Link
                            to="/security"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <Shield size={16} className="mr-3 text-gray-400" />
                            Security
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