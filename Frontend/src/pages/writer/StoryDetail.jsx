import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStoryById, deleteStory, toggleLike } from '../../store/slices/storySlice'; // Assuming updateStoryStatus is in storySlice too
import WriterLayout from '../../components/Layout/WriterLayout';
import { toast } from 'react-toastify'; // For notifications

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentStory, loading, error } = useSelector((state) => state.story);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchStoryById(id));
    }
  }, [dispatch, id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      dispatch(deleteStory(id))
        .unwrap()
        .then(() => {
          toast.success('Story deleted successfully.');
          navigate('/writer/stories');
        })
        .catch((err) => {
          toast.error(`Failed to delete story: ${err}`);
        });
    }
  };

  const handleLike = () => {
    // Note: Writers usually don't like their own stories, but keeping the button if needed.
    dispatch(toggleLike(id));
  };

  const handleStatusChange = (newStatus) => {
    toast.info(`Status change to ${newStatus} (functionality pending).`);
  };

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      published: { color: 'bg-green-100 text-green-800', label: 'Published' },
      archived: { color: 'bg-yellow-100 text-yellow-800', label: 'Archived' },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center !px-3 !py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Loading State
  if (loading) {
    return (
      <WriterLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </WriterLayout>
    );
  }

  // Error State or Story Not Found
  if (error || !currentStory) {
    return (
      <WriterLayout>
        <div className="text-center !py-12 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-red-600 !mb-4">
            {error ? 'Error Loading Story' : 'Story Not Found'}
          </h2>
          <p className="text-gray-600 !mb-6">{error || 'The story you are looking for does not exist or could not be loaded.'}</p>
          <Link 
            to="/writer/stories" 
            className="inline-flex items-center !px-6 !py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            ← Back to Stories
          </Link>
        </div>
      </WriterLayout>
    );
  }
  
  // Determine if the current logged-in user has liked this story
  const isLiked = user && currentStory.likes.includes(user._id);

  return (
    <WriterLayout>
      <div className="!max-w-6xl !mx-auto !space-y-8">
        {/* Back Link */}
        <Link 
          to="/writer/stories" 
          className="text-primary-600 hover:text-primary-700 !mb-4 inline-flex items-center !space-x-2 group"
        >
           <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span>Back to Stories</span>
        </Link>
        
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Banner Image */}
          <div 
            className="h-48 md:h-64 w-full bg-gradient-to-r from-gray-300 to-gray-400 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${currentStory.bannerImage?.url || '/default-banner.jpg'})` }}
          >
             {/* Overlay for contrast if needed */}
             {/* <div className="absolute inset-0 bg-black opacity-20"></div> */}
          </div>
          
          <div className="!p-6 md:!p-8">
            <div className="md:flex md:items-end md:!space-x-6 -mt-16 md:-mt-20 relative z-10">
               {/* Cover Image */}
               <img 
                 src={currentStory.coverImage?.url || '/default-cover.jpg'} 
                 alt={currentStory.title}
                 className="w-32 h-44 md:w-40 md:h-56 object-cover rounded-lg border-4 border-white shadow-lg flex-shrink-0"
                 style={{ aspectRatio: '1 / 1.414' }} // Maintain A4-like ratio
               />
               <div className="flex-1 !mt-4 md:!mt-0">
                  {/* Title and Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                     <h1 className="text-3xl md:text-4xl font-bold text-gray-900 !mb-2 sm:!mb-0 line-clamp-2">
                       {currentStory.title}
                     </h1>
                     {getStatusBadge(currentStory.status)}
                  </div>
                  {/* Author (Yourself) */}
                  <p className="text-gray-600 !mt-1">
                     By {user?.firstName} {user?.lastName}
                  </p>
               </div>
            </div>

             {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 !mt-6 !pt-6 border-t border-gray-200">
               <Link
                 to={`/writer/stories/edit/${currentStory._id}`}
                 className="inline-flex items-center !space-x-2 bg-blue-600 text-white !px-5 !py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                 <span>Edit Story</span>
               </Link>
               <button
                 onClick={handleDelete}
                 className="inline-flex items-center !space-x-2 bg-red-600 text-white !px-5 !py-2.5 rounded-lg hover:bg-red-700 transition font-medium"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 <span>Delete Story</span>
               </button>
               <Link
                  to={`/stories/${currentStory._id}`} // Link to public view
                  target="_blank" // Open in new tab
                  rel="noopener noreferrer"
                  className="inline-flex items-center !space-x-2 bg-gray-600 text-white !px-5 !py-2.5 rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <span>View Public</span>
               </Link>
            </div>
          </div>
        </div>

        {/* Story Stats */}
        <div className="bg-white rounded-xl shadow-md !p-6">
          <h2 className="text-xl font-semibold text-gray-800 !mb-4">Story Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <div className="text-center bg-blue-50 !p-4 rounded-lg border border-blue-100">
               <div className="text-3xl font-bold text-blue-600">{currentStory.views || 0}</div>
               <div className="text-sm text-blue-800 !mt-1 font-medium">Views</div>
             </div>
             <div className="text-center bg-red-50 !p-4 rounded-lg border border-red-100">
               <div className="text-3xl font-bold text-red-600">{currentStory.likesCount || 0}</div>
               <div className="text-sm text-red-800 !mt-1 font-medium">Likes</div>
             </div>
             <div className="text-center bg-purple-50 !p-4 rounded-lg border border-purple-100">
                <div className="text-3xl font-bold text-purple-600">0</div> {/* Assuming comments aren't directly on story model */}
                <div className="text-sm text-purple-800 !mt-1 font-medium">Comments</div>
             </div>
             <div className="text-center bg-gray-50 !p-4 rounded-lg border border-gray-100">
               <div className="text-lg font-bold text-gray-700">
                 {currentStory.publishedAt 
                   ? new Date(currentStory.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                   : '—'
                 }
               </div>
               <div className="text-sm text-gray-500 !mt-1 font-medium">Published Date</div>
             </div>
          </div>
        </div>

        {/* Story Details & Content */}
        <div className="bg-white rounded-xl shadow-md !p-6 md:!p-8 !space-y-6">
          
          {/* Meta Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 !mb-4">Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
              <div className="flex items-start">
                  <span className="font-medium w-32 flex-shrink-0">Categories:</span>
                  <span>{currentStory.categories?.map(cat => cat.name).join(', ') || 'N/A'}</span>
              </div>
              <div className="flex items-start">
                  <span className="font-medium w-32 flex-shrink-0">Audience:</span>
                  <span>{currentStory.targetAudience?.title || 'N/A'}</span>
              </div>
              <div className="flex items-start">
                  <span className="font-medium w-32 flex-shrink-0">Language:</span>
                  <span>{currentStory.language || 'N/A'}</span>
              </div>
              <div className="flex items-start">
                  <span className="font-medium w-32 flex-shrink-0">Copyright:</span>
                  <span className="capitalize">{currentStory.copyright?.replace('-', ' ') || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {currentStory.tags && currentStory.tags.length > 0 && (
            <div className="!pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-800 !mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {currentStory.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center !px-3 !py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 border border-primary-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Main Characters */}
          {currentStory.mainCharacters && currentStory.mainCharacters.length > 0 && (
            <div className="!pt-6 border-t">
              <h3 className="text-xl font-semibold text-gray-800 !mb-4">Main Characters</h3>
              <div className="!space-y-4">
                {currentStory.mainCharacters.map((character, index) => (
                  <div key={index} className="border rounded-lg !p-4 bg-gray-50">
                    <div className="flex justify-between items-start !mb-2">
                      <h4 className="font-semibold text-lg text-gray-900">{character.name}</h4>
                      <span className="inline-flex items-center !px-2.5 !py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800 capitalize">
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
          <div className="!pt-6 border-t">
            <h3 className="text-xl font-semibold text-gray-800 !mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed italic">{currentStory.description}</p>
          </div>

          {/* Story Content */}
          <div className="!pt-6 border-t">
            <h3 className="text-xl font-semibold text-gray-800 !mb-4">Story Content</h3>
            <div 
              className="prose prose-lg max-w-none prose-p:!my-4 prose-headings:!mb-4 prose-headings:!mt-6"
              dangerouslySetInnerHTML={{ __html: currentStory.content }}
            />
          </div>
        </div>

        {/* Status Management Section */}
        <div className="bg-white rounded-xl shadow-md !p-6">
           <h2 className="text-xl font-semibold text-gray-800 !mb-4">Manage Status</h2>
           <div className="flex flex-wrap items-center gap-4">
              <span className="font-medium text-gray-700">Current Status:</span>
              {getStatusBadge(currentStory.status)}
              
              <div className="flex-grow border-t md:border-0 md:!ml-auto"></div> {/* Spacer */}

              {currentStory.status === 'draft' && (
                <button
                  onClick={() => handleStatusChange('published')}
                  className="inline-flex items-center !space-x-2 bg-green-600 text-white !px-5 !py-2.5 rounded-lg hover:bg-green-700 transition font-medium"
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <span>Publish Story</span>
                </button>
              )}
              {currentStory.status === 'published' && (
                <button
                  onClick={() => handleStatusChange('archived')}
                  className="inline-flex items-center !space-x-2 bg-yellow-500 text-white !px-5 !py-2.5 rounded-lg hover:bg-yellow-600 transition font-medium"
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                   <span>Archive Story</span>
                </button>
              )}
              {currentStory.status === 'archived' && (
                <button
                  onClick={() => handleStatusChange('published')}
                  className="inline-flex items-center !space-x-2 bg-green-600 text-white !px-5 !py-2.5 rounded-lg hover:bg-green-700 transition font-medium"
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0015.058 2m0 0H15" /></svg>
                   <span>Restore Story</span>
                </button>
              )}
              {/* Option to revert to draft (if needed) */}
              {(currentStory.status === 'published' || currentStory.status === 'archived') && (
                 <button
                   onClick={() => handleStatusChange('draft')}
                   className="inline-flex items-center !space-x-2 bg-gray-500 text-white !px-5 !py-2.5 rounded-lg hover:bg-gray-600 transition font-medium"
                 >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    <span>Revert to Draft</span>
                 </button>
              )}
           </div>
        </div>

      </div>
    </WriterLayout>
  );
};

export default StoryDetail;