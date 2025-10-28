// src/components/Story/StoryPosterCard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike } from '../../store/slices/storySlice'; // Adjust path
import { toggleStoryInList, updateListStatus } from '../../store/slices/myListSlice'; // Adjust path
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const StoryPosterCard = ({ story }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stories: myList, listStatus } = useSelector((state) => state.myList);

  if (!story) {
    console.warn("StoryPosterCard received undefined story prop");
    return null;
  }

  // Check like status from both Redux state and localStorage for persistence
  const isLiked = story.isLikedByCurrentUser === true || localStorage.getItem(`liked_${story._id}`) === 'true';
  
  // Check my list status from Redux state (real-time)
  const isSaved = listStatus[story._id] === true;

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to like stories.');
      navigate('/login');
      return;
    }
    dispatch(toggleLike(story._id));
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to save stories.');
      navigate('/login');
      return;
    }
    
    // Update UI immediately
    const currentStatus = listStatus[story._id];
    dispatch(updateListStatus({ storyId: story._id, isInList: !currentStatus }));
    
    dispatch(toggleStoryInList(story._id))
      .unwrap()
      .then((payload) => {
        toast.success(payload.message);
      })
      .catch((err) => {
        // Revert UI if failed
        dispatch(updateListStatus({ storyId: story._id, isInList: currentStatus }));
        toast.error(err);
      });
  };

  const title = story.title || 'Untitled Story';
  const authorName = `${story.author?.firstName || ''} ${story.author?.lastName || 'Unknown Author'}`.trim();
  const coverImageUrl = story.coverImage?.url || '/default-poster.jpg';
  const viewCount = story.views || 0;

  // Define A4-like pixel dimensions (approx ratio 1:1.414)
  const posterWidth = '212px'; // Example width
  const posterHeight = '300px'; // Corresponding height

  return (
    // Set width on the main container to control card size in the grid
    <div 
      className="group !relative !block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 !w-full" 
      style={{ maxWidth: posterWidth }} // Ensure card doesn't exceed desired width
    >
      <Link to={`/stories/${story._id}`}>
        {/* Container with Fixed Pixel Dimensions */}
        <div
          className="!w-full !bg-gray-200"
          style={{ 
            width: '100%', // Take full width of parent div
            height: posterHeight // Set fixed height
          }} 
        >
          <img
            src={coverImageUrl}
            alt={title}
            className="!w-full !h-full !object-cover !transition-transform !duration-300 group-hover:!scale-105"
            onError={(e) => { e.target.src = '/default-poster.jpg'; }}
          />
        </div>

        {/* Overlay for Title + Icons (appears on hover) */}
        <div className="!absolute !inset-0 !bg-gradient-to-t !from-black/80 !via-black/40 !to-transparent !opacity-0 group-hover:!opacity-100 !transition-opacity !duration-300 !flex !flex-col !justify-between !p-4">
           
           {/* Top Section: Icons */}
           <div className="!flex !justify-end !space-x-2 !z-10">
              {/* Save Icon with Tooltip */}
              <button
                onClick={handleSaveClick}
                className={`!text-xl hover:!text-yellow-400 !transition-colors !duration-200 !p-1.5 !bg-black/40 hover:!bg-black/60 !rounded-full focus:!outline-none cursor-pointer ${
                  isSaved ? '!text-yellow-400' : '!text-white'
                }`}
                aria-label={isSaved ? 'Remove from My List' : 'Save to My List'}
                title={isSaved ? 'Remove from My List' : 'Save to My List'}
              >
                {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              </button>
              {/* Like Icon with Tooltip */}
              <button
                onClick={handleLikeClick}
                className={`!text-xl hover:!text-purple-400 !transition-colors !duration-200 !p-1.5 !bg-black/40 hover:!bg-black/60 !rounded-full focus:!outline-none cursor-pointer ${
                  isLiked ? '!text-purple-500' : '!text-white'
                }`}
                aria-label={isLiked ? 'Unlike Story' : 'Like Story'}
                title={isLiked ? 'Unlike Story' : 'Like Story'}
              >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </button>
           </div>
          
           {/* Bottom Section: Title, Author, Views */}
           <div>
             <h3 className="!text-white !font-semibold !text-lg !line-clamp-2 !mb-1">
               {title}
             </h3>
             <p className="!text-gray-300 !text-sm">
               By {authorName}
             </p>
             {/* View Count Display */}
             <div className="!flex !items-center !space-x-1 !text-gray-300 !text-xs !mt-2">
                <FaEye />
                <span>{viewCount} Views</span>
             </div>
           </div>
        </div>
      </Link>
    </div>
  );
};

export default StoryPosterCard;