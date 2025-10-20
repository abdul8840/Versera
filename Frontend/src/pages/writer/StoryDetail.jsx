import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStoryById, deleteStory, toggleLike } from '../../store/slices/storySlice';
import WriterLayout from '../../components/Layout/WriterLayout';

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentStory, loading } = useSelector((state) => state.story);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchStoryById(id));
    }
  }, [dispatch, id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      dispatch(deleteStory(id));
      navigate('/writer/stories');
    }
  };

  const handleLike = () => {
    dispatch(toggleLike(id));
  };

  const handleStatusChange = (newStatus) => {
    // This would dispatch an updateStory action with new status
    console.log('Change status to:', newStatus);
  };

  if (loading) {
    return (
      <WriterLayout>
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </WriterLayout>
    );
  }

  if (!currentStory) {
    return (
      <WriterLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Story not found</h2>
          <Link to="/writer/stories" className="text-primary-600 hover:text-primary-700">
            Back to Stories
          </Link>
        </div>
      </WriterLayout>
    );
  }

  return (
    <WriterLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header with Actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link 
              to="/writer/stories" 
              className="text-primary-600 hover:text-primary-700 mb-2 inline-block"
            >
              ← Back to Stories
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{currentStory.title}</h1>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/writer/stories/edit/${currentStory._id}`}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Edit Story
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Delete Story
            </button>
          </div>
        </div>

        {/* Story Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{currentStory.views}</div>
              <div className="text-sm text-gray-500">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{currentStory.likesCount}</div>
              <div className="text-sm text-gray-500">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {currentStory.status.charAt(0).toUpperCase() + currentStory.status.slice(1)}
              </div>
              <div className="text-sm text-gray-500">Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {currentStory.publishedAt 
                  ? new Date(currentStory.publishedAt).toLocaleDateString()
                  : 'Not published'
                }
              </div>
              <div className="text-sm text-gray-500">Published</div>
            </div>
          </div>
        </div>

        {/* Story Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Banner Image */}
          {currentStory.bannerImage?.url && (
            <img
              src={currentStory.bannerImage.url}
              alt={currentStory.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          {/* Story Meta */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
            <div>
              <strong>Categories:</strong>{' '}
              {currentStory.categories?.map(cat => cat.name).join(', ')}
            </div>
            <div>
              <strong>Target Audience:</strong> {currentStory.targetAudience?.title}
            </div>
            <div>
              <strong>Language:</strong> {currentStory.language}
            </div>
            <div>
              <strong>Copyright:</strong> {currentStory.copyright}
            </div>
          </div>

          {/* Tags */}
          {currentStory.tags && currentStory.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {currentStory.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Main Characters */}
          {currentStory.mainCharacters && currentStory.mainCharacters.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Main Characters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentStory.mainCharacters.map((character, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{character.name}</h4>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {character.role}
                      </span>
                    </div>
                    {character.description && (
                      <p className="text-sm text-gray-600">{character.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{currentStory.description}</p>
          </div>

          {/* Story Content */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Story Content</h3>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: currentStory.content }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="flex space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                  currentStory.isLiked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-700'
                } hover:bg-gray-200`}
              >
                <svg className="w-5 h-5" fill={currentStory.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{currentStory.likesCount} Likes</span>
              </button>
              
              <Link
                to={`/stories/${currentStory._id}`}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>View Public Page</span>
              </Link>
            </div>

            {/* Status Management */}
            <div className="flex space-x-2">
              {currentStory.status === 'draft' && (
                <button
                  onClick={() => handleStatusChange('published')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Publish Story
                </button>
              )}
              {currentStory.status === 'published' && (
                <button
                  onClick={() => handleStatusChange('archived')}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                >
                  Archive Story
                </button>
              )}
              {currentStory.status === 'archived' && (
                <button
                  onClick={() => handleStatusChange('published')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Restore Story
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </WriterLayout>
  );
};

export default StoryDetail;