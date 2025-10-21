import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchWriterStories, deleteStory } from '../../store/slices/storySlice';
import WriterLayout from '../../components/Layout/WriterLayout';

const StoriesList = () => {
  const dispatch = useDispatch();
  const { stories, loading, error, success } = useSelector((state) => state.story);
  
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchWriterStories(filters));
  }, [dispatch, filters]);

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handleDelete = (storyId) => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      dispatch(deleteStory(storyId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      published: { color: 'bg-green-100 text-green-800', label: 'Published' },
      archived: { color: 'bg-yellow-100 text-yellow-800', label: 'Archived' },
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredStories = filters.status 
    ? stories.filter(story => story.status === filters.status)
    : stories;

  return (
    <WriterLayout>
      <div className="!space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Stories</h1>
            <p className="text-gray-600 !mt-1">Manage and track your published stories</p>
          </div>
          <Link
            to="/writer/stories/create"
            className="bg-purple-600 text-white !px-6 !py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Create New Story
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm !p-4">
          <div className="flex !space-x-4">
            <button
              onClick={() => handleStatusFilter('')}
              className={`!px-4 !py-2 rounded-md transition ${
                filters.status === '' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Stories
            </button>
            <button
              onClick={() => handleStatusFilter('draft')}
              className={`!px-4 !py-2 rounded-md transition ${
                filters.status === 'draft' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Drafts
            </button>
            <button
              onClick={() => handleStatusFilter('published')}
              className={`!px-4 !py-2 rounded-md transition ${
                filters.status === 'published' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => handleStatusFilter('archived')}
              className={`!px-4 !py-2 rounded-md transition ${
                filters.status === 'archived' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        {/* Stories List */}
        {loading ? (
          <div className="flex justify-center !py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredStories.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Story
                    </th>
                    <th className="!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Likes
                    </th>
                    <th className="!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStories.map((story) => (
                    <tr key={story._id} className="hover:bg-gray-50">
                      <td className="!px-6 !py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 object-cover rounded"
                              src={story.coverImage?.url}
                              alt={story.title}
                            />
                          </div>
                          <div className="!ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {story.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {story.categories?.map(cat => cat.name).join(', ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="!px-6 !py-4 whitespace-nowrap">
                        {getStatusBadge(story.status)}
                      </td>
                      <td className="!px-6 !py-4 whitespace-nowrap text-sm text-gray-900">
                        {story.views}
                      </td>
                      <td className="!px-6 !py-4 whitespace-nowrap text-sm text-gray-900">
                        {story.likesCount}
                      </td>
                      <td className="!px-6 !py-4 whitespace-nowrap text-sm text-gray-500">
                        {story.publishedAt 
                          ? new Date(story.publishedAt).toLocaleDateString()
                          : 'Not published'
                        }
                      </td>
                      <td className="!px-6 !py-4 whitespace-nowrap text-sm font-medium !space-x-2">
                        <Link
                          to={`/writer/stories/edit/${story._id}`}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/stories/${story._id}`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(story._id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm !p-12 text-center">
            <svg className="!mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="!mt-2 text-sm font-medium text-gray-900">No stories found</h3>
            <p className="!mt-1 text-sm text-gray-500">
              {filters.status ? `No ${filters.status} stories found.` : 'Get started by creating your first story.'}
            </p>
            <div className="!mt-6">
              <Link
                to="/writer/stories/create"
                className="inline-flex items-center !px-4 !py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Create Story
              </Link>
            </div>
          </div>
        )}
      </div>
    </WriterLayout>
  );
};

export default StoriesList;