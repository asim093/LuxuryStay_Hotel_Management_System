"use client"
import { useState } from 'react';
import { Menu, X, Search, User } from 'lucide-react';
import Login from './Login/Login';
import Signup from './Signup/Signup';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isloginmodalopen, setisloginmodalopen] = useState(false);
  const [issignupmodalopen, setissignupmodalopen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Places', href: '#' },
    { name: 'Experiences', href: '#' },
    { name: 'About', href: '#' }
  ];

  const handlelogin = () => {
    setisloginmodalopen(true);
  };

  const handleCloseLogin = () => {
    setisloginmodalopen(false);
  };

  const handleSignupClick = () => {
    setisloginmodalopen(false);
    setissignupmodalopen(true);
  };

  const handleCloseSignup = () => {
    setissignupmodalopen(false);
  };

  const handleLoginFromSignup = () => {
    setissignupmodalopen(false);
    setisloginmodalopen(true);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      {/* Login Modal */}
      <Login 
        isModalOpen={isloginmodalopen} 
        onClose={handleCloseLogin}
        onSignupClick={handleSignupClick}
      />

      {issignupmodalopen && (
        <Signup
          isModalOpen={issignupmodalopen}
          onClose={handleCloseSignup}
          onLoginClick={handleLoginFromSignup}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full mr-2 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-xl font-semibold">QuickStay</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Right Side - Search & Login */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white p-2 rounded-md transition-colors duration-200">
              <Search size={20} />
            </button>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2" 
              onClick={handlelogin}
            >
              <User size={16} />
              <span>Login</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}

            {/* Mobile Search & Login */}
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex flex-col space-y-3 px-3">
                <button className="text-gray-300 hover:text-white flex items-center space-x-2 py-2 transition-colors duration-200">
                  <Search size={20} />
                  <span>Search</span>
                </button>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  onClick={handlelogin}
                >
                  <User size={16} />
                  <span>Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

