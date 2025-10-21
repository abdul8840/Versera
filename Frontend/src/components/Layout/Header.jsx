// components/Layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active link based on current route
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

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

  const isLinkActive = (href) => activeLink === href;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50' 
        : 'bg-white shadow-lg border-b border-gray-200'
    }`}>
      <div className="max-w-7xl !mx-auto !px-4 sm:!px-6 lg:!px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center !space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md group"
              onClick={() => setActiveLink('/')}
            >
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
                Versera
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links - Center */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex !space-x-8 relative">
              {navigationLinks.map((item, index) => (
                <div key={item.name} className="relative">
                  <Link
                    to={item.href}
                    className={`relative !px-1 !py-2 text-sm font-medium transition-all duration-300 focus:outline-none focus:text-primary-600 ${
                      isLinkActive(item.href)
                        ? 'text-primary-600 font-semibold'
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                    onClick={() => setActiveLink(item.href)}
                  >
                    {item.name}
                    
                    {/* Active underline */}
                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-300 ${
                      isLinkActive(item.href) ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                    }`}></span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - User Menu / Auth Buttons */}
          <div className="flex items-center !space-x-4">
            {user ? (
              /* User is logged in */
              <div className="flex items-center !space-x-4">
                {/* Desktop User Info */}
                <div className="hidden lg:flex items-center !space-x-3">
                  <span className="text-sm text-gray-700">
                    Welcome, <span className="font-semibold bg-purple-600 bg-clip-text text-transparent">
                      {user.firstName}
                    </span>
                  </span>
                  <span className={`inline-flex items-center !px-3 !py-1 rounded-full text-xs font-medium capitalize border transition-all duration-300 ${
                    user.role === 'writer' 
                      ? 'bg-purple-100 text-purple-800 border-purple-200 shadow-sm' 
                      : 'bg-green-100 text-green-800 border-green-200 shadow-sm'
                  }`}>
                    {user.role === 'writer' ? '✍️' : '📖'} {user.role}
                  </span>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center !space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full !p-1 group cursor-pointer"
                    aria-label="User menu"
                    aria-expanded={isProfileMenuOpen}
                  >
                    <div className="w-9 h-9 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transition-all duration-300 ${
                        isProfileMenuOpen ? 'rotate-180 text-primary-600' : 'group-hover:text-primary-600'
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
                    <div className="absolute right-0 !mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 !py-2 z-50">
                      {/* User Info */}
                      <div className="!px-4 !py-3 border-b border-gray-200/50">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate !mt-1 flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full !mr-2 animate-pulse"></span>
                          {user.email}
                        </p>
                        <p className={`text-xs font-medium capitalize !mt-2 inline-flex items-center !px-2 !py-1 rounded-full ${
                          user.role === 'writer' 
                            ? 'bg-purple-500/10 text-purple-700 border border-purple-200' 
                            : 'bg-green-500/10 text-green-700 border border-green-200'
                        }`}>
                          {user.role === 'writer' ? '✍️ Writer' : '📖 Reader'}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={handleProfileNavigation}
                          className="flex items-center w-full !px-4 !py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center !mr-3 group-hover:scale-110 transition-transform duration-200">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">My Profile</div>
                            <div className="text-xs text-gray-500">Manage your account</div>
                          </div>
                        </button>

                        <button
                          onClick={handleDashboardNavigation}
                          className="flex items-center w-full !px-4 !py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center !mr-3 group-hover:scale-110 transition-transform duration-200">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Dashboard</div>
                            <div className="text-xs text-gray-500">Your workspace</div>
                          </div>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-200/50 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full !px-4 !py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group cursor-pointer"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center !mr-3 group-hover:scale-110 transition-transform duration-200">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Logout</div>
                            <div className="text-xs text-red-500">Sign out of your account</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* User is not logged in */
              <div className="hidden md:flex items-center !space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 !px-4 !py-2 text-sm font-medium transition-all duration-300 focus:outline-none focus:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white !px-5 !py-2.5 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-md"
                >
                  Get Started <span className="ml-1">🚀</span>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center !p-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset transition-all duration-300"
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
          <div className="md:hidden border-t border-gray-200/50 !pt-4 !pb-3 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-2xl">
            <div className="!px-2 !space-y-1">
              {/* Mobile Navigation Links */}
              {navigationLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block !px-3 !py-3 text-base font-medium transition-all duration-300 focus:outline-none ${
                    isLinkActive(item.href)
                      ? 'text-primary-600 font-semibold'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                  onClick={() => {
                    setActiveLink(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full !mr-3 transition-all duration-300 ${
                      isLinkActive(item.href) ? 'bg-primary-500' : 'bg-gray-300'
                    }`}></span>
                    {item.name}
                  </div>
                </Link>
              ))}

              {/* Mobile Auth Section */}
              {user ? (
                <>
                  <div className="border-t border-gray-200/50 !mt-4 !pt-4">
                    <div className="!px-3 !py-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500 truncate !mt-1">
                        {user.email}
                      </p>
                      <p className={`text-xs font-medium capitalize !mt-2 inline-flex items-center !px-2 !py-1 rounded-full ${
                        user.role === 'writer' 
                          ? 'bg-purple-500/20 text-purple-700' 
                          : 'bg-green-500/20 text-green-700'
                      }`}>
                        {user.role === 'writer' ? '✍️ Writer' : '📖 Reader'}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleProfileNavigation}
                      className="block w-full text-left !px-3 !py-3 text-base font-medium text-gray-600 hover:text-primary-600 transition-all duration-300 !mt-2"
                    >
                      My Profile
                    </button>
                    
                    <button
                      onClick={handleDashboardNavigation}
                      className="block w-full text-left !px-3 !py-3 text-base font-medium text-gray-600 hover:text-primary-600 transition-all duration-300"
                    >
                      Dashboard
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left !px-3 !py-3 text-base font-medium text-red-600 hover:text-red-700 transition-all duration-300 !mt-2 border-t border-gray-200/50"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200/50 !mt-4 !pt-4 !space-y-2">
                  <Link
                    to="/login"
                    className="block !px-3 !py-3 text-base font-medium text-gray-600 hover:text-primary-600 transition-all duration-300 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block !px-3 !py-3 text-base font-medium bg-purple-600 text-white hover:shadow-lg transition-all duration-300 text-center shadow-md rounded-lg"
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