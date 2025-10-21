// src/components/Story/StoryPosterCard.jsx
// No changes needed here, relies on isLikedByCurrentUser field set by the reducer.
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike } from '../../store/slices/storySlice'; // Adjust path
import { toggleStoryInList } from '../../store/slices/myListSlice'; // Adjust path
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { toast } from 'react-toastify';

const StoryPosterCard = ({ story }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stories: myList } = useSelector((state) => state.myList);

  if (!story) {
    console.warn("StoryPosterCard received undefined story prop");
    return null;
  }

  // Use isLikedByCurrentUser directly (should be correctly set by reducer now)
  const isLiked = story.isLikedByCurrentUser === true; 
  
  const isSaved = myList.some((savedStory) => savedStory?._id === story._id);

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
    dispatch(toggleStoryInList(story._id))
      .unwrap()
      .then((payload) => toast.success(payload.message))
      .catch((err) => toast.error(err));
  };

  const title = story.title || 'Untitled Story';
  const authorName = `${story.author?.firstName || ''} ${story.author?.lastName || 'Unknown Author'}`.trim();
  const coverImageUrl = story.coverImage?.url || '/default-poster.jpg';

  return (
    <div className="group !relative !block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link to={`/stories/${story._id}`}>
        {/* A4 Aspect Ratio Container */}
        <div
          className="!w-full !bg-gray-200"
          style={{ aspectRatio: '1 / 1.414' }}
        >
          <img
            src={coverImageUrl}
            alt={title}
            className="!w-full !h-full !object-cover !transition-transform !duration-300 group-hover:!scale-105"
            onError={(e) => { e.target.src = '/default-poster.jpg'; }}
          />
        </div>

        {/* Overlay for Title + Icons */}
        <div className="!absolute !inset-0 !bg-gradient-to-t !from-black/80 !via-black/40 !to-transparent !opacity-0 group-hover:!opacity-100 !transition-opacity !duration-300 !flex !flex-col !justify-end !p-4">
           {/* Icons */}
           <div className="!absolute !top-3 !right-3 !flex !space-x-2 !z-10">
              {/* Save Icon */}
              <button
                onClick={handleSaveClick}
                className="!text-white !text-xl hover:!text-yellow-400 !transition-colors !duration-200 !p-1.5 !bg-black/40 hover:!bg-black/60 !rounded-full focus:!outline-none"
                aria-label={isSaved ? 'Remove from My List' : 'Save to My List'}
              >
                {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              </button>
              {/* Like Icon */}
              <button
                onClick={handleLikeClick}
                className={`!text-xl hover:!text-purple-400 !transition-colors !duration-200 !p-1.5 !bg-black/40 hover:!bg-black/60 !rounded-full focus:!outline-none ${isLiked ? '!text-purple-500' : '!text-white'}`}
                aria-label={isLiked ? 'Unlike Story' : 'Like Story'}
              >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </button>
           </div>
          
           {/* Story Title & Author */}
           <h3 className="!text-white !font-semibold !text-lg !line-clamp-2">
             {title}
           </h3>
           <p className="!text-gray-300 !text-sm !mt-1">
             By {authorName}
           </p>
        </div>
      </Link>
    </div>
  );
};

export default StoryPosterCard;