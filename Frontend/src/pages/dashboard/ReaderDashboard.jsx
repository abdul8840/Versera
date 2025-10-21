// pages/dashboard/ReaderDashboard.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ReaderLayout from '../../components/Layout/ReaderLayout';
import { fetchReaderDashboard } from '../../store/slices/dashboardSlice';

const ReaderDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Get dynamic data from the dashboard slice
  const { stats, recentlyRead, recommendedStories, loading, error } = useSelector(
    (state) => state.dashboard
  );

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchReaderDashboard());
  }, [dispatch]);

  // --- MERGE DYNAMIC DATA WITH MOCK DATA ---
  // We keep the mock data for features we haven't built yet
  const dashboardStats = {
    ...stats, // This brings in dynamic data: storiesRead, likesGiven, commentsWritten, writersFollowed
    recentlyRead: recentlyRead,
    recommendedStories: recommendedStories,
    
    // This data remains mock, as it requires new backend models:
    readingTime: '45h 32m',
    readingStreak: 15,
    monthlyGoal: 12,
    monthlyProgress: 8,
    favoriteGenres: ['Fantasy', 'Mystery', 'Science Fiction'],
  };
  // ------------------------------------------

  const progressPercentage = Math.round((dashboardStats.monthlyProgress / dashboardStats.monthlyGoal) * 100);

  if (loading) {
    return <ReaderLayout><div className="flex justify-center items-center h-64">Loading...</div></ReaderLayout>;
  }

  if (error) {
    return <ReaderLayout><div className="text-red-500">Error: {error}</div></ReaderLayout>;
  }

  return (
    <ReaderLayout>
      <div className="!space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl !p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold !mb-2">Welcome back, {user?.firstName}! 👋</h1>
              <p className="text-green-100 text-lg">
                {dashboardStats.readingStreak > 0 
                  ? `You're on a ${dashboardStats.readingStreak}-day reading streak! 🔥`
                  : 'Ready to discover your next favorite story?'}
              </p>
            </div>
            <div className="!mt-4 md:!mt-0">
              <Link
                to="/stories"
                className="bg-white text-green-600 !px-6 !py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-block"
              >
                📚 Browse Stories
              </Link>
            </div>
          </div>
        </div>

        {/* Main Stats Grid (NOW DYNAMIC) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white !p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stories Saved</p>
                <p className="text-3xl font-bold text-gray-900 !mt-2">{dashboardStats.storiesRead}</p>
              </div>
              <div className="bg-blue-100 !p-3 rounded-lg">
                <span className="text-blue-600 text-xl">📖</span>
              </div>
            </div>
          </div>

          <div className="bg-white !p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Likes Given</p>
                <p className="text-3xl font-bold text-gray-900 !mt-2">{dashboardStats.likesGiven}</p>
              </div>
              <div className="bg-green-100 !p-3 rounded-lg">
                <span className="text-green-600 text-xl">❤️</span>
              </div>
            </div>
          </div>

          <div className="bg-white !p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Comments</p>
                <p className="text-3xl font-bold text-gray-900 !mt-2">{dashboardStats.commentsWritten}</p>
              </div>
              <div className="bg-purple-100 !p-3 rounded-lg">
                <span className="text-purple-600 text-xl">💬</span>
              </div>
            </div>
          </div>

          <div className="bg-white !p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Writers Followed</p>
                <p className="text-3xl font-bold text-gray-900 !mt-2">{dashboardStats.writersFollowed}</p>
              </div>
              <div className="bg-yellow-100 !p-3 rounded-lg">
                <span className="text-yellow-600 text-xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Progress and Recent Activity (Partially Dynamic) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reading Progress (Still Mock) */}
          <div className="bg-white !p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 !mb-4">Monthly Reading Goal</h2>
            <p className="text-xs text-gray-500 !mb-2">Note: This section is static until a reading history feature is built.</p>
            <div>
              <div className="flex justify-between items-center !mb-2">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-semibold text-gray-900">
                  {dashboardStats.monthlyProgress}/{dashboardStats.monthlyGoal} books ({progressPercentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Favorite Genres (Still Mock) */}
          <div className="bg-white !p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 !mb-4">Your Favorite Genres</h2>
            <p className="text-xs text-gray-500 !mb-2">Note: This section is static until genre-tracking is built.</p>
            <div className="flex flex-wrap gap-2">
              {dashboardStats.favoriteGenres.map((genre, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-green-100 to-blue-100 !px-4 !py-2 rounded-full text-sm font-medium text-gray-700 border border-green-200"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recently Read & Recommendations (NOW DYNAMIC) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recently Read (from My List) */}
          <div className="bg-white !p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center !mb-4">
              <h2 className="text-xl font-bold text-gray-900">From Your List</h2>
              <Link
                to="/my-list" // This link now works!
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="!space-y-4">
              {dashboardStats.recentlyRead.length > 0 ? (
                dashboardStats.recentlyRead.map((story, index) => (
                <div key={index} className="flex items-center justify-between !p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{story.title}</p>
                    <p className="text-sm text-gray-500">{story.author}</p>
                  </div>
                </div>
              ))) : (
                <p className="text-sm text-gray-500">You haven't added any stories to your list yet.</p>
              )}
            </div>
          </div>

          {/* Recommended Stories (Dynamic) */}
          <div className="bg-white !p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center !mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recommended For You</h2>
              <Link
                to="/stories"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Browse More
              </Link>
            </div>
            <div className="!space-y-4">
              {dashboardStats.recommendedStories.length > 0 ? (
                dashboardStats.recommendedStories.map((story, index) => (
                <div key={index} className="!p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                  <p className="font-medium text-gray-900">{story.title}</p>
                  <div className="flex justify-between items-center !mt-2">
                    <p className="text-sm text-gray-500">{story.author}</p>
                    <span className="bg-purple-100 text-purple-800 !px-2 !py-1 rounded text-xs font-medium">
                      {story.genre}
                    </span>
                  </div>
                </div>
              ))) : (
                <p className="text-sm text-gray-500">No recommendations available right now.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions (Links) */}
        <div className="bg-white !p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 !mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/stories"
              className="flex flex-col items-center justify-center !p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
            >
              <span className="text-2xl !mb-2 group-hover:scale-110 transition-transform">🔍</span>
              <span className="font-medium text-gray-700">Browse Stories</span>
            </Link>
            
            <Link
              to="/my-list"
              className="flex flex-col items-center justify-center !p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors group"
            >
              <span className="text-2xl !mb-2 group-hover:scale-110 transition-transform">❤️</span>
              <span className="font-medium text-gray-700">My Favorites</span>
            </Link>
            
            {/* Note: /following does not exist yet */}
            <Link
              to="/following"
              className="flex flex-col items-center justify-center !p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <span className="text-2xl !mb-2 group-hover:scale-110 transition-transform">👥</span>
              <span className="font-medium text-gray-700">Following</span>
            </Link>
            
            <Link
              to="/reader/profile"
              className="flex flex-col items-center justify-center !p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
            >
              <span className="text-2xl !mb-2 group-hover:scale-110 transition-transform">👤</span>
              <span className="font-medium text-gray-700">My Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </ReaderLayout>
  );
};

export default ReaderDashboard;