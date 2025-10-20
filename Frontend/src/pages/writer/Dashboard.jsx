import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchWriterStories } from '../../store/slices/storySlice';
import WriterLayout from '../../components/Layout/WriterLayout';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stories, loading } = useSelector((state) => state.story);

  useEffect(() => {
    dispatch(fetchWriterStories({ limit: 5 }));
  }, [dispatch]);

  const stats = {
    totalStories: stories.length,
    publishedStories: stories.filter(story => story.status === 'published').length,
    totalViews: stories.reduce((sum, story) => sum + story.views, 0),
    totalLikes: stories.reduce((sum, story) => sum + story.likesCount, 0),
  };

  const recentStories = stories.slice(0, 5);

  return (
    <WriterLayout>
      <div className="!space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your stories today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm !p-6">
            <div className="flex items-center">
              <div className="!p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="!ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Stories</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalStories}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm !p-6">
            <div className="flex items-center">
              <div className="!p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="!ml-4">
                <h3 className="text-sm font-medium text-gray-500">Published</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.publishedStories}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm !p-6">
            <div className="flex items-center">
              <div className="!p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="!ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm !p-6">
            <div className="flex items-center">
              <div className="!p-3 rounded-full bg-red-100 text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="!ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Likes</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalLikes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Stories */}
        <div className="bg-white rounded-lg shadow-sm !p-6">
          <div className="flex justify-between items-center !mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Stories</h2>
            <Link
              to="/writer/stories"
              className="bg-primary-600 text-white !px-4 !py-2 rounded-md hover:bg-primary-700 transition"
            >
              View All Stories
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center !py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : recentStories.length > 0 ? (
            <div className="space-y-4">
              {recentStories.map((story) => (
                <div key={story._id} className="flex items-center justify-between !p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={story.coverImage?.url}
                      alt={story.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{story.title}</h3>
                      <p className="text-sm text-gray-500">
                        {story.status} • {story.views} views • {story.likesCount} likes
                      </p>
                    </div>
                  </div>
                  <div className="flex !space-x-2">
                    <Link
                      to={`/writer/stories/edit/${story._id}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/stories/${story._id}`}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center !py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="!mt-2 text-sm font-medium text-gray-900">No stories</h3>
              <p className="!mt-1 text-sm text-gray-500">Get started by creating your first story.</p>
              <div className="!mt-6">
                <Link
                  to="/writer/stories/create"
                  className="inline-flex items-center !px-4 !py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Create Story
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm !p-6">
          <h2 className="text-xl font-semibold text-gray-900 !mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/writer/stories/create"
              className="!p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary-300 hover:bg-primary-50 transition"
            >
              <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="!mt-2 block text-sm font-medium text-gray-900">Create New Story</span>
            </Link>
            
            <Link
              to="/writer/stories"
              className="!p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary-300 hover:bg-primary-50 transition"
            >
              <svg className="!mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="!mt-2 block text-sm font-medium text-gray-900">Manage Stories</span>
            </Link>
            
            <Link
              to="/writer/analytics"
              className="!p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary-300 hover:bg-primary-50 transition"
            >
              <svg className="!mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="!mt-2 block text-sm font-medium text-gray-900">View Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </WriterLayout>
  );
};

export default Dashboard;