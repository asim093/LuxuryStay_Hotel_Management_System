"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useClientSide } from "../../hooks/useClientSide";
import dynamic from "next/dynamic";
import { Menu, User } from "lucide-react";

// Dynamic imports to prevent SSR
const LoginModal = dynamic(() => import("../Login/Login"), { ssr: false });
const SignupModal = dynamic(() => import("../Signup/Signup"), { ssr: false });

export default function Navbar() {
  const { user, isAuthenticated, logout, isInitialized } = useAuth();
  const isClient = useClientSide();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/pages/About' },
    { name: 'Contact', href: '/pages/Contact' },
    { name: 'Hotels', href: '/pages/Hotels' },
    { name: 'Destinations', href: '/pages/Destinations' },
  ];

  const userNavItems = [
    { name: 'My Bookings', href: '/pages/MyBookings' },
    { name: 'Profile', href: '/pages/Profile' },
  ];

  // Listen for demo button clicks
  useEffect(() => {
    const handleOpenSignup = () => {
      setIsSignupModalOpen(true);
    };

    const handleOpenLogin = () => {
      setIsLoginModalOpen(true);
    };

    window.addEventListener('openSignup', handleOpenSignup);
    window.addEventListener('openLogin', handleOpenLogin);

    return () => {
      window.removeEventListener('openSignup', handleOpenSignup);
      window.removeEventListener('openLogin', handleOpenLogin);
    };
  }, []);

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleSignupClick = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleCloseSignup = () => {
    setIsSignupModalOpen(false);
  };

  const handleLoginFromSignup = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (href) => {
    // This function is not used in the current code,
    // but it's a placeholder for future navigation logic.
    // For now, it just prevents default link behavior.
    // If you want to handle navigation, you'd use window.location.href or a router.
    // For example: window.location.href = href;
  };


  return (
    <>
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
        {/* Logo */}
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl font-bold text-primary">
            LuxuryStay
          </Link>
        </div>

        {/* Center Navigation - Desktop */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="font-medium hover:text-primary transition-colors"
                  prefetch={true}
                  onClick={() => handleNavigation(item.href)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side */}
        <div className="navbar-end gap-2">
          {/* Search - Hidden on small screens */}
          <div className="form-control hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="input input-bordered input-sm w-auto"
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="dropdown dropdown-end lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <Menu size={20} />
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:bg-primary hover:text-primary-content transition-colors duration-200" prefetch={true} onClick={() => handleNavigation(item.href)}>{item.name}</Link>
                </li>
              ))}
              {isClient && isInitialized && !isAuthenticated && (
                <>
                  <div className="divider"></div>
                  <li><button onClick={handleSignupClick} className="hover:bg-primary hover:text-primary-content transition-colors duration-200">Sign Up</button></li>
                  <li><button onClick={handleLogin} className="hover:bg-primary hover:text-primary-content transition-colors duration-200">Login</button></li>
                </>
              )}
            </ul>
          </div>

          {/* User Authentication Section */}
          {!isClient || !isInitialized ? (
            // Loading skeleton
            <div className="hidden lg:flex items-center space-x-2">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            isAuthenticated ? (
              // User Avatar Dropdown
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-primary transition-all duration-200">
                  <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {user?.profileImage ? (
                      <img
                        alt="User Avatar"
                        src={user.profileImage}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border"
                >
                  <li className="menu-title">
                    <span className="text-sm font-semibold text-primary">
                      Welcome, {user?.name || 'User'}
                    </span>
                  </li>
                  <div className="divider my-1"></div>
                  {userNavItems.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="hover:bg-primary hover:text-primary-content transition-colors duration-200">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <div className="divider my-1"></div>
                  <li>
                    <button onClick={handleLogout} className="text-error hover:bg-error hover:text-error-content transition-colors duration-200">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              // Login and Signup Buttons
              <div className="hidden lg:flex items-center space-x-2">
                <button
                  className="btn btn-outline btn-sm hover:btn-primary transition-all duration-200"
                  onClick={handleSignupClick}
                >
                  <User size={16} />
                  Sign Up
                </button>
                <button
                  className="btn btn-primary btn-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  onClick={handleLogin}
                >
                  <User size={16} />
                  Login
                </button>
              </div>
            )
          )}


        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLogin}
        handleSignupClick={handleSignupClick}
      />

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={handleCloseSignup}
        onLoginClick={handleLoginFromSignup}
      />
    </>
  );
}