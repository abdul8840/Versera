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
    dispatch(fetchWriterStories({ limit: 10 }));
  }, [dispatch]);

  // Calculate statistics
  const stats = {
    totalStories: stories.length,
    publishedStories: stories.filter(story => story.status === 'published').length,
    draftStories: stories.filter(story => story.status === 'draft').length,
    archivedStories: stories.filter(story => story.status === 'archived').length,
    totalViews: stories.reduce((sum, story) => sum + story.views, 0),
    totalLikes: stories.reduce((sum, story) => sum + story.likesCount, 0),
  };

  const recentStories = stories.slice(0, 5);
  const popularStories = [...stories]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      published: { color: 'bg-green-100 text-green-800', label: 'Published' },
      archived: { color: 'bg-yellow-100 text-yellow-800', label: 'Archived' },
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center !px-2.5 !py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // A4 Poster Size: 210mm x 297mm (approx 8.27in x 11.69in)
  // For web, we'll use a ratio of 1:1.414 (A4 ratio)
  const posterStyle = {
    width: '100%',
    aspectRatio: '1 / 1.414', // A4 ratio
    maxWidth: '300px', // Maximum size for posters
  };

  return (
    <WriterLayout>
      <div className="!space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm !p-6">
          <h1 className="text-3xl font-bold text-gray-900 !mb-2">
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

        {/* Popular Stories as A4 Posters */}
        {popularStories.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm !p-6">
            <h2 className="text-xl font-semibold text-gray-900 !mb-6">Most Popular Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularStories.map((story) => (
                <div key={story._id} className="group">
                  {/* A4 Poster Container */}
                  <Link
                    to={`/writer/stories/${story._id}`}
                    className="block relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={posterStyle}
                  >
                    {/* Poster Image */}
                    <img
                      src={story.coverImage?.url || '/default-poster.jpg'}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay with Story Info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end !p-4">
                      <h3 className="text-white font-semibold text-lg !mb-2 line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="text-gray-200 text-sm !mb-3 line-clamp-2">
                        {story.description}
                      </p>
                      <div className="flex justify-between items-center text-white text-xs">
                        <span>{story.views} views</span>
                        <span>{story.likesCount} likes</span>
                        {getStatusBadge(story.status)}
                      </div>
                    </div>

                    {/* Status Badge - Always Visible */}
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(story.status)}
                    </div>

                    {/* Click Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/50 rounded-full !p-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                  </Link>

                  {/* Story Title Below Poster */}
                  <div className="!mt-3 text-center">
                    <h3 className="font-medium text-gray-900 line-clamp-1">{story.title}</h3>
                    <p className="text-sm text-gray-500 !mt-1">
                      {story.views} views • {story.likesCount} likes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Stories */}
        <div className="bg-white rounded-lg shadow-sm !p-6">
          <div className="flex justify-between items-center !mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Stories</h2>
            <Link
              to="/writer/stories"
              className="bg-purple-600 text-white !px-4 !py-2 rounded-md hover:bg-purple-700 transition"
            >
              View All Stories
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center !py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : recentStories.length > 0 ? (
            <div className="!space-y-4">
              {recentStories.map((story) => (
                <div key={story._id} className="flex items-center justify-between !p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center !space-x-4">
                    {/* Small A4-style thumbnail */}
                    <Link
                      to={`/writer/stories/${story._id}`}
                      className="block w-20 h-28 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      style={{ aspectRatio: '1 / 1.414' }}
                    >
                      <img
                        src={story.coverImage?.url || '/default-poster.jpg'}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center !space-x-2 !mb-1">
                        <Link
                          to={`/writer/stories/${story._id}`}
                          className="font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                        >
                          {story.title}
                        </Link>
                        {getStatusBadge(story.status)}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {story.description}
                      </p>
                      <div className="flex !space-x-4 text-sm text-gray-500 !mt-1">
                        <span>{story.views} views</span>
                        <span>{story.likesCount} likes</span>
                        <span>
                          {story.publishedAt 
                            ? new Date(story.publishedAt).toLocaleDateString()
                            : 'Not published'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex !space-x-2">
                    <Link
                      to={`/writer/stories/edit/${story._id}`}
                      className="text-purple-600 hover:text-purple-700 !px-3 !py-1 rounded border border-purple-600 hover:bg-purple-50 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/writer/stories/${story._id}`}
                      className="text-gray-600 hover:text-gray-700 !px-3 !py-1 rounded border border-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center !py-8">
              <svg className="!mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="!mt-2 text-sm font-medium text-gray-900">No stories yet</h3>
              <p className="!mt-1 text-sm text-gray-500">Get started by creating your first story.</p>
              <div className="!mt-6">
                <Link
                  to="/writer/stories/create"
                  className="inline-flex items-center !px-4 !py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
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
              className="!p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-300 hover:bg-purple-50 transition group"
            >
              <svg className="!mx-auto h-8 w-8 text-gray-400 group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="!mt-2 block text-sm font-medium text-gray-900 group-hover:text-purple-600">Create New Story</span>
            </Link>
            
            <Link
              to="/writer/stories"
              className="!p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-300 hover:bg-purple-50 transition group"
            >
              <svg className="!mx-auto h-8 w-8 text-gray-400 group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="!mt-2 block text-sm font-medium text-gray-900 group-hover:text-purple-600">Manage Stories</span>
            </Link>
            
            <Link
              to="/writer/analytics"
              className="!p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-300 hover:bg-purple-50 transition group"
            >
              <svg className="!mx-auto h-8 w-8 text-gray-400 group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="!mt-2 block text-sm font-medium text-gray-900 group-hover:text-purple-600">View Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </WriterLayout>
  );
};

export default Dashboard;