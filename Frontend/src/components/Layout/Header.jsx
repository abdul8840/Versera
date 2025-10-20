// components/Layout/Header.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const handleDashboardNavigation = () => {
    if (user?.role === 'writer') {
      navigate('/writer/dashboard');
    } else {
      navigate('/dashboard');
    }
    setIsProfileMenuOpen(false);
  };

  const handleProfileNavigation = () => {
    if (user?.role === 'writer') {
      navigate('/writer/profile');
    } else {
      navigate('/reader/profile');
    }
    setIsProfileMenuOpen(false);
  };

  const navigationLinks = [
    { name: 'Home', href: '/', current: false },
    { name: 'About', href: '/about', current: false },
    { name: 'Stories', href: '/stories', current: false },
    { name: 'Contact', href: '/contact', current: false },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
                Versera
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links - Center */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-8">
              {navigationLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              /* User is logged in */
              <div className="flex items-center space-x-4">
                {/* Desktop User Info */}
                <div className="hidden lg:flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Welcome, <span className="font-semibold">{user.firstName}</span>
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    user.role === 'writer' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full p-1"
                    aria-label="User menu"
                    aria-expanded={isProfileMenuOpen}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        isProfileMenuOpen ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {user.email}
                        </p>
                        <p className={`text-xs font-medium capitalize mt-1 ${
                          user.role === 'writer' ? 'text-purple-600' : 'text-green-600'
                        }`}>
                          {user.role}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={handleProfileNavigation}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Profile
                        </button>

                        <button
                          onClick={handleDashboardNavigation}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Dashboard
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* User is not logged in */
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-3">
            <div className="px-2 space-y-1">
              {/* Mobile Navigation Links */}
              {navigationLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              {user ? (
                <>
                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                      <p className={`text-xs font-medium capitalize mt-1 ${
                        user.role === 'writer' ? 'text-purple-600' : 'text-green-600'
                      }`}>
                        {user.role}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleProfileNavigation}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                    >
                      My Profile
                    </button>
                    
                    <button
                      onClick={handleDashboardNavigation}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                    >
                      Dashboard
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isProfileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Header;