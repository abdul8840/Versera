// components/Layout/WriterLayout.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const WriterLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('WriterLayout - User:', user); // Debug log

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-100 text-primary-600' : 'text-gray-700';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Loading writer layout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/writer/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-primary-600">Versera Writer</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-white rounded-lg shadow-sm p-6 mr-6">
              <nav className="space-y-2">
                <Link
                  to="/writer/dashboard"
                  className={`block px-4 py-2 rounded-md transition ${isActive('/writer/dashboard')}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/writer/stories"
                  className={`block px-4 py-2 rounded-md transition ${isActive('/writer/stories')}`}
                >
                  My Stories
                </Link>
                <Link
                  to="/writer/stories/create"
                  className={`block px-4 py-2 rounded-md transition ${isActive('/writer/stories/create')}`}
                >
                  Create Story
                </Link>
                <Link
                  to="/writer/analytics"
                  className={`block px-4 py-2 rounded-md transition ${isActive('/writer/analytics')}`}
                >
                  Analytics
                </Link>
                <Link
                  to="/writer/profile"
                  className={`block px-4 py-2 rounded-md transition ${isActive('/writer/profile')}`}
                >
                  Profile
                </Link>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterLayout;