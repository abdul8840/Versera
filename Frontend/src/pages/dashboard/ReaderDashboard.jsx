// pages/dashboard/ReaderDashboard.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReaderLayout from '../../components/Layout/ReaderLayout';

const ReaderDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Mock data for reader dashboard
  const dashboardStats = {
    storiesRead: 24,
    likesGiven: 156,
    commentsWritten: 42,
    writersFollowed: 8,
    readingTime: '45h 32m',
    readingStreak: 15,
    monthlyGoal: 12,
    monthlyProgress: 8,
    favoriteGenres: ['Fantasy', 'Mystery', 'Science Fiction'],
    recentlyRead: [
      { title: 'The Midnight Library', author: 'Matt Haig', progress: 100 },
      { title: 'Digital Fortress', author: 'Dan Brown', progress: 75 },
      { title: 'Project Hail Mary', author: 'Andy Weir', progress: 30 }
    ],
    recommendedStories: [
      { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Mystery' },
      { title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction' },
      { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy' }
    ]
  };

  const progressPercentage = Math.round((dashboardStats.monthlyProgress / dashboardStats.monthlyGoal) * 100);

  return (
    <ReaderLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}! 👋</h1>
              <p className="text-green-100 text-lg">
                {dashboardStats.readingStreak > 0 
                  ? `You're on a ${dashboardStats.readingStreak}-day reading streak! 🔥`
                  : 'Ready to discover your next favorite story?'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/stories"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-block"
              >
                📚 Browse Stories
              </Link>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stories Read</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats.storiesRead}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-blue-600 text-xl">📖</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <span className="text-green-500">↑</span>
                <span className="ml-1">12% from last month</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Likes Given</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats.likesGiven}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-green-600 text-xl">❤️</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <span>Supporting writers</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Comments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats.commentsWritten}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-purple-600 text-xl">💬</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <span>Engaging with stories</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Writers Followed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats.writersFollowed}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="text-yellow-600 text-xl">⭐</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <span>Following creators</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Progress and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reading Progress */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Reading Goal</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.readingStreak}</p>
                  <p className="text-sm text-gray-600">Day Streak</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.readingTime}</p>
                  <p className="text-sm text-gray-600">Total Reading</p>
                </div>
              </div>
            </div>
          </div>

          {/* Favorite Genres */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Favorite Genres</h2>
            <div className="flex flex-wrap gap-2">
              {dashboardStats.favoriteGenres.map((genre, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-green-200"
                >
                  {genre}
                </span>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="/preferences"
                className="text-green-600 hover:text-green-700 text-sm font-medium inline-flex items-center"
              >
                Update preferences
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recently Read & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recently Read */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recently Read</h2>
              <Link
                to="/reading-history"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardStats.recentlyRead.map((story, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{story.title}</p>
                    <p className="text-sm text-gray-500">{story.author}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {story.progress === 100 ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        Completed
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {story.progress}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Stories */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recommended For You</h2>
              <Link
                to="/stories"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Browse More
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardStats.recommendedStories.map((story, index) => (
                <div key={index} className="p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                  <p className="font-medium text-gray-900">{story.title}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">{story.author}</p>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                      {story.genre}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/stories"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔍</span>
              <span className="font-medium text-gray-700">Browse Stories</span>
            </Link>
            
            <Link
              to="/favorites"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">❤️</span>
              <span className="font-medium text-gray-700">My Favorites</span>
            </Link>
            
            <Link
              to="/following"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</span>
              <span className="font-medium text-gray-700">Following</span>
            </Link>
            
            <Link
              to="/reader/profile"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">👤</span>
              <span className="font-medium text-gray-700">My Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </ReaderLayout>
  );
};

export default ReaderDashboard;