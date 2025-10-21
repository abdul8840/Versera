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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };


  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Define sidebar links with icons and paths
  const sidebarLinks = [
    { name: 'Dashboard', path: '/writer/dashboard', icon: '📊' },
    { name: 'My Stories', path: '/writer/stories', icon: '📚' },
    { name: 'Create Story', path: '/writer/stories/create', icon: '➕' },
    { name: 'Analytics', path: '/writer/analytics', icon: '📈' }, // Note: This route isn't in App.jsx yet
    { name: 'Profile', path: '/writer/profile', icon: '👤' },
    { name: 'My List', path: '/my-list', icon: '❤️' }, // Added My List page
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          Loading..
          <p className="!mt-4 text-gray-600">Loading writer layout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl !mx-auto !px-4 sm:!px-6 lg:!px-8">
          <div className="flex justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link to="/writer/dashboard" className="flex items-center !space-x-2">
                {/* You can add a logo image here */}
                <span className="text-2xl font-bold text-blue-600">✍️ Versera Writer</span>
              </Link>
            </div>
            
            {/* User Info & Logout */}
            <div className="flex items-center !space-x-4">
              <div className="flex items-center !space-x-2">
                 <img 
                   src={user.profilePicture || '/default-avatar.png'} 
                   alt="Profile" 
                   className="w-8 h-8 rounded-full object-cover border border-gray-300"
                 />
                 <span className="text-gray-800 font-medium hidden sm:inline">
                   {user?.firstName} {user?.lastName}
                 </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white !px-4 !py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 max-w-7xl !mx-auto w-full !py-6 sm:!px-6 lg:!px-8">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-lg shadow-md !p-4 !mr-6 flex-shrink-0 self-start sticky top-20"> {/* Made sidebar sticky */}
          <nav className="!space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center !space-x-3 !px-4 !py-3 rounded-lg transition font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-100 text-blue-700' // Active state styles
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' // Inactive state styles
                }`}
              >
                <span className="text-lg">{link.icon}</span> 
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white rounded-lg shadow-md min-h-[calc(100vh-10rem)]"> {/* Ensure content area takes space */}
           {/* We add padding inside the children now */}
           {children}
        </main>
      </div>
    </div>
  );
};

export default WriterLayout;