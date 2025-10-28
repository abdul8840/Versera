import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaUserCircle, FaEye, FaCalendarAlt, FaBookOpen, FaTags, FaShare, FaReadme } from 'react-icons/fa';

import { fetchStoryById, clearCurrentStory, toggleLike, incrementStoryView, markStoryAsViewed, initializeLikeStatus } from '../store/slices/storySlice';
import { fetchMyList, toggleStoryInList, updateListStatus } from '../store/slices/myListSlice';
import CommentList from '../components/Comment/CommentList';
import StoryPosterCard from '../components/Story/StoryPosterCard';

const StoryDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasIncrementedView = useRef(false); // Track if view has been incremented

  const { user } = useSelector((state) => state.auth);
  const { currentStory: story, loading, error, viewedStories } = useSelector((state) => state.story);
  const { stories: allStories } = useSelector((state) => state.story);
  const { stories: myList, loading: myListLoading, listStatus } = useSelector((state) => state.myList);

  useEffect(() => {
    if (id) {
      // First fetch the story
      dispatch(fetchStoryById(id)).then((result) => {
        if (result.payload && result.payload.story) {
          // Initialize like status from localStorage
          dispatch(initializeLikeStatus({ storyId: id }));
          
          // Increment view only once per component mount (not on refresh)
          if (!hasIncrementedView.current) {
            hasIncrementedView.current = true;
            
            // Also check if not already viewed in this session
            if (!viewedStories.includes(id)) {
              dispatch(incrementStoryView(id))
                .unwrap()
                .then(() => {
                  // Mark as viewed to prevent duplicate increments in same session
                  dispatch(markStoryAsViewed(id));
                })
                .catch((err) => {
                  console.error('Failed to increment view:', err);
                });
            }
          }
        }
      });
    }
    
    if (user) {
      dispatch(fetchMyList());
    }
    
    return () => {
      dispatch(clearCurrentStory());
      // Reset the ref when component unmounts
      hasIncrementedView.current = false;
    };
  }, [id, dispatch, user]);

  const handleStoryLike = () => {
    if (!user) {
      toast.error('Please log in to like stories.');
      navigate('/login');
      return;
    }
    dispatch(toggleLike(story._id));
  };

  const handleAddToList = () => {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Story link copied to clipboard!');
    }
  };

  if (loading || (user && myListLoading)) {
    return (
      <div className="!flex !justify-center !items-center !min-h-screen !bg-gradient-to-br !from-purple-50 !to-blue-50">
        <div className="!animate-pulse !flex !flex-col !items-center !space-y-4">
          <div className="!w-16 !h-16 !bg-gradient-to-r !from-purple-500 !to-blue-500 !rounded-full !animate-spin"></div>
          <p className="!text-gray-600 !font-medium">Loading your story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="!flex !justify-center !items-center !min-h-screen !bg-gradient-to-br !from-red-50 !to-orange-50">
        <div className="!text-center !bg-white !p-8 !rounded-2xl !shadow-xl !border !border-red-100 !max-w-md">
          <div className="!w-20 !h-20 !bg-gradient-to-r !from-red-500 !to-orange-500 !rounded-full !flex !items-center !justify-center !mx-auto !mb-4">
            <FaReadme className="!text-white !text-2xl" />
          </div>
          <h2 className="!text-2xl !font-bold !text-red-600 !mb-4">Story Unavailable</h2>
          <p className="!text-gray-600 !mb-6">{error}</p>
          <Link
            to="/stories"
            className="!inline-block !bg-gradient-to-r !from-red-500 !to-orange-500 !text-white !px-6 !py-3 !rounded-xl !font-semibold hover:!shadow-lg !transition-all !duration-300"
          >
            Explore Stories
          </Link>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="!flex !justify-center !items-center !min-h-screen !bg-gradient-to-br !from-gray-50 !to-blue-50">
        <div className="!text-center !bg-white !p-8 !rounded-2xl !shadow-xl !border !border-blue-100 !max-w-md">
          <div className="!w-20 !h-20 !bg-gradient-to-r !from-blue-500 !to-purple-500 !rounded-full !flex !items-center !justify-center !mx-auto !mb-4">
            <FaBookOpen className="!text-white !text-2xl" />
          </div>
          <h2 className="!text-2xl !font-bold !text-gray-700 !mb-4">Story Not Found</h2>
          <p className="!text-gray-600 !mb-6">The story you're looking for has wandered off the page.</p>
          <Link
            to="/stories"
            className="!inline-block !bg-gradient-to-r !from-blue-500 !to-purple-500 !text-white !px-6 !py-3 !rounded-xl !font-semibold hover:!shadow-lg !transition-all !duration-300"
          >
            Discover Stories
          </Link>
        </div>
      </div>
    );
  }

  const relatedStories = (allStories || [])
    .filter(s => s && story && s._id !== story._id && s.categories?.some(cat => story.categories?.find(sc => sc._id === cat._id)))
    .slice(0, 4);

  // Check like status from both Redux state and localStorage for persistence
  const isLiked = story.isLikedByCurrentUser === true || localStorage.getItem(`liked_${story._id}`) === 'true';
  
  // Check my list status from Redux state (real-time)
  const isSaved = listStatus[story._id] === true;

  const publishedDate = story.publishedAt ? new Date(story.publishedAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : 'Not published';

  return (
    <div className="!bg-gradient-to-br !from-purple-50 !via-blue-50 !to-indigo-50 !min-h-screen !pt-16">
      {/* Animated Background Elements */}
      <div className="!fixed !inset-0 !overflow-hidden !pointer-events-none">
        <div className="!absolute !-top-40 !-right-32 !w-80 !h-80 !bg-gradient-to-r !from-purple-200 !to-pink-200 !rounded-full !opacity-20 !blur-xl !animate-pulse"></div>
        <div className="!absolute !-bottom-40 !-left-32 !w-80 !h-80 !bg-gradient-to-r !from-blue-200 !to-cyan-200 !rounded-full !opacity-20 !blur-xl !animate-pulse !animation-delay-2000"></div>
        <div className="!absolute !top-1/2 !left-1/4 !w-60 !h-60 !bg-gradient-to-r !from-indigo-200 !to-purple-200 !rounded-full !opacity-15 !blur-lg !animate-bounce"></div>
      </div>

      <div className="!relative !w-full !h-80 md:!h-[500px] !overflow-hidden">
        <div
          className="!absolute !inset-0 !bg-cover !bg-center !bg-no-repeat !transform !scale-100 hover:!scale-105 !transition-transform !duration-700"
          style={{ backgroundImage: `url(${story.bannerImage?.url || '/default-banner.jpg'})` }}
          onError={(e) => { e.target.style.backgroundImage = `url('/default-banner.jpg')`; }}
        ></div>
      </div>

      <div className="!max-w-7xl !mx-auto !px-4 !py-8 md:!flex md:!space-x-8 -!mt-24 md:-!mt-36 !relative !z-10">

        {/* === Left Column: Enhanced Sticky Section === */}
        <aside className="md:!w-1/3 lg:!w-1/4 !mb-8 md:!mb-0">
          <div className="!sticky !top-24 !space-y-6">
            {/* Enhanced Cover Image with Glow Effect */}
            <div className="!relative !group">
              <div className="!absolute !-inset-4 !bg-gradient-to-r !from-purple-400 !to-blue-400 !rounded-2xl !blur !opacity-30 !group-hover:!opacity-50 !transition !duration-300"></div>
              <img
                src={story.coverImage?.url || '/default-poster.jpg'}
                alt={story.title}
                className="!relative !rounded-xl !shadow-2xl !w-full !border-4 !border-white !transform !group-hover:!scale-105 !transition-transform !duration-300"
                style={{ aspectRatio: '1 / 1.414' }}
                onError={(e) => { e.target.src = '/default-poster.jpg'; }}
              />
            </div>

            {/* Enhanced Action Buttons */}
            <div className="!bg-white/80 !backdrop-blur-sm !p-4 !rounded-2xl !shadow-lg !border !border-white/20">
              <div className="!flex !justify-around !items-center">
                <button
                  onClick={handleStoryLike}
                  className={`!flex !flex-col !items-center !space-y-2 !p-3 !rounded-xl !transition-all !duration-300 cursor-pointer ${
                    isLiked 
                      ? '!text-white !bg-gradient-to-r !from-pink-500 !to-red-500 !shadow-lg !shadow-pink-200' 
                      : '!text-gray-600 !bg-white !shadow-md hover:!shadow-lg hover:!text-pink-500'
                  }`}
                  title={isLiked ? 'Unlike Story' : 'Like Story'}
                >
                  {isLiked ? <FaHeart className="!text-xl" /> : <FaRegHeart className="!text-xl" />}
                  <span className="!text-xs !font-medium">Like</span>
                </button>

                <button
                  onClick={handleAddToList}
                  className={`!flex !flex-col !items-center !space-y-2 !p-3 !rounded-xl !transition-all !duration-300 cursor-pointer ${
                    isSaved 
                      ? '!text-white !bg-gradient-to-r !from-yellow-500 !to-orange-500 !shadow-lg !shadow-yellow-200' 
                      : '!text-gray-600 !bg-white !shadow-md hover:!shadow-lg hover:!text-yellow-500'
                  }`}
                  title={isSaved ? 'Remove from My List' : 'Save to My List'}
                >
                  {isSaved ? <FaBookmark className="!text-xl" /> : <FaRegBookmark className="!text-xl" />}
                  <span className="!text-xs !font-medium">Save</span>
                </button>

                <button
                  onClick={handleShare}
                  className="!flex !flex-col !items-center !space-y-2 !p-3 !rounded-xl !transition-all !duration-300 !text-gray-600 !bg-white !shadow-md hover:!shadow-lg hover:!text-blue-500 cursor-pointer"
                  title="Share Story"
                >
                  <FaShare className="!text-xl" />
                  <span className="!text-xs !font-medium">Share</span>
                </button>
              </div>
            </div>

            {/* Enhanced Meta Info Box */}
            <div className="!bg-white/80 !backdrop-blur-sm !p-6 !rounded-2xl !shadow-lg !border !border-white/20">
              <h2 className="!text-2xl !font-bold !mb-4 !text-gray-800 !leading-tight !line-clamp-3">{story.title}</h2>
              <div className="!space-y-4 !text-sm">
                {[
                  { icon: FaUserCircle, text: `By ${story.author?.firstName} ${story.author?.lastName}`, color: '!text-gray-600' },
                  { icon: FaEye, text: `${story.views || 0} Views`, color: '!text-blue-500' },
                  { icon: FaHeart, text: `${story.likesCount ?? 0} Likes`, color: '!text-red-500' },
                  { icon: FaCalendarAlt, text: `Published: ${publishedDate}`, color: '!text-green-500' },
                  { icon: FaBookOpen, text: `Audience: ${story.targetAudience?.title || 'General'}`, color: '!text-purple-500' },
                ].map((item, index) => (
                  <div key={index} className="!flex !items-center !space-x-3 !p-2 !rounded-lg !bg-gray-50/50">
                    <item.icon className={`!text-lg ${item.color}`} />
                    <span className="!text-gray-700 !font-medium">{item.text}</span>
                  </div>
                ))}
                
                {/* Enhanced Categories */}
                <div className="!pt-3 !border-t !border-gray-200/50">
                  <h4 className="!font-semibold !mb-3 !text-gray-700 !flex !items-center !space-x-2">
                    <FaTags className="!text-purple-500" />
                    <span>Categories</span>
                  </h4>
                  <div className="!flex !flex-wrap !gap-2">
                    {story.categories?.map(cat => (
                      <span 
                        key={cat._id} 
                        className="!bg-gradient-to-r !from-purple-100 !to-blue-100 !text-purple-800 !text-xs !font-semibold !px-3 !py-2 !rounded-full !border !border-purple-200 !shadow-sm"
                      >
                        {cat.name}
                      </span>
                    ))}
                    {(!story.categories || story.categories.length === 0) && (
                      <span className="!text-xs !text-gray-500 !italic">No categories</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* === Right Column: Enhanced Content Area === */}
        <main className="md:!w-2/3 lg:!w-3/4 !space-y-8">

          {/* Enhanced Story Content Section */}
          <div className="!bg-white/80 !backdrop-blur-sm !p-8 !rounded-2xl !shadow-xl !border !border-white/20">
            {/* Description with Enhanced Design */}
            <div className="!mb-8 !pb-6 !border-b !border-gray-200/50">
              <div className="!flex !items-center !space-x-3 !mb-4">
                <div className="!w-2 !h-8 !bg-gradient-to-b !from-purple-500 !to-blue-500 !rounded-full"></div>
                <h3 className="!text-2xl !font-bold !bg-gradient-to-r !from-purple-600 !to-blue-600 !bg-clip-text !text-transparent">
                  Description
                </h3>
              </div>
              <p className=" !text-lg !leading-relaxed !bg-gradient-to-r !from-gray-800 !to-gray-600 !bg-clip-text !text-transparent !font-medium">
                {story.description}
              </p>
            </div>

            {/* Enhanced Tags Section */}
            {story.tags && story.tags.length > 0 && (
              <div className="!mb-8">
                <h3 className="!text-xl !font-semibold !text-gray-800 !mb-4 !flex !items-center !space-x-3">
                  <FaTags className="!text-blue-500" />
                  <span>Story Tags</span>
                </h3>
                <div className="!flex !flex-wrap !gap-3">
                  {story.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="!inline-flex !items-center !px-4 !py-2 !rounded-full !text-sm !font-semibold !bg-gradient-to-r !from-blue-50 !to-cyan-50 !text-blue-700 !border !border-blue-200 !shadow-sm hover:!shadow-md !transition-shadow !duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Main Content with Beautiful Typography */}
            <div>
              <div className="!flex !items-center !space-x-3 !mb-6">
                <div className="!w-2 !h-8 !bg-gradient-to-b !from-indigo-500 !to-purple-500 !rounded-full"></div>
                <h3 className="!text-2xl !font-bold !bg-gradient-to-r !from-indigo-600 !to-purple-600 !bg-clip-text !text-transparent">
                  The Story
                </h3>
              </div>
              
              {/* Enhanced Content Container */}
              <div className="!relative">
                {/* Decorative Elements */}
                <div className="!absolute !-left-8 !top-0 !bottom-0 !w-1 !bg-gradient-to-b !from-purple-200 !via-blue-200 !to-transparent"></div>
                
                {/* Content with Enhanced Typography */}
                <div 
                  className="!prose !prose-lg !lg:prose-xl !max-w-none 
                    !prose-p:!my-6 !prose-p:!leading-relaxed !prose-p:!text-gray-700
                    !prose-headings:!my-8 !prose-headings:!bg-gradient-to-r !prose-headings:!from-gray-800 !prose-headings:!to-gray-600 !prose-headings:!bg-clip-text !prose-headings:!text-transparent
                    !prose-blockquote:!border-l-4 !prose-blockquote:!border-purple-400 !prose-blockquote:!bg-purple-50 !prose-blockquote:!py-4 !prose-blockquote:!px-6 !prose-blockquote:!rounded-r-xl
                    !prose-a:!text-blue-600 !prose-a:!font-medium hover:!prose-a:!text-blue-800
                    !prose-strong:!text-gray-900 !prose-strong:!font-bold
                    !prose-em:!text-purple-600 !prose-em:!italic
                    !prose-ul:!my-6 !prose-ol:!my-6
                    !prose-li:!my-2 !prose-li:!text-gray-700
                    !prose-img:!rounded-xl !prose-img:!shadow-md font-serif text-gray-800"
                  dangerouslySetInnerHTML={{ __html: story.content }}
                ></div>
              </div>
            </div>
          </div>

          {/* Enhanced Author Box */}
          <div className="!bg-gradient-to-r !from-white !to-blue-50 !p-6 !rounded-2xl !shadow-lg !border !border-blue-100 !flex !items-center !space-x-6">
            <div className="!relative">
              <div className="!absolute !-inset-2 !bg-gradient-to-r !from-blue-400 !to-purple-400 !rounded-full !blur !opacity-30"></div>
              <img
                src={story.author?.profilePicture || '/default-avatar.png'}
                alt={story.author?.firstName}
                className="!relative !w-20 !h-20 !rounded-full !object-cover !border-4 !border-white !shadow-lg"
                onError={(e) => { e.target.src = '/default-avatar.png'; }}
              />
            </div>
            <div className="!flex-1">
              <h4 className="!text-xl !font-bold !bg-gradient-to-r !from-blue-600 !to-purple-600 !bg-clip-text !text-transparent">
                About {story.author?.firstName} {story.author?.lastName}
              </h4>
              <p className="!text-gray-600 !mt-2 !text-sm !leading-relaxed !bg-white/50 !p-4 !rounded-lg !border !border-gray-100">
                {story.author?.bio || 'This author prefers to let their stories speak for themselves.'}
              </p>
            </div>
          </div>

          {/* Enhanced Comment Section */}
          <div className="!bg-white/80 !backdrop-blur-sm !p-6 !rounded-2xl !shadow-xl !border !border-white/20">
            <CommentList storyId={story._id} />
          </div>

        </main>
      </div>

      {/* Enhanced Related Stories Section */}
      {relatedStories.length > 0 && (
        <div className="!container !mx-auto !px-4 !py-16 !mt-12 !relative">
          {/* Background Decoration */}
          <div className="!absolute !inset-x-0 !top-0 !h-32 !bg-gradient-to-b !from-transparent !to-purple-50/50"></div>
          
          <div className="!relative !z-10">
            <h2 className="!text-4xl !font-bold !text-center !mb-12 !bg-gradient-to-r !from-purple-600 !to-blue-600 !bg-clip-text !text-transparent">
              More Stories You'll Love
            </h2>
            <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 !gap-8">
              {relatedStories.map(relatedStory => (
                relatedStory && (
                  <div key={relatedStory._id} className="!transform hover:!scale-105 !transition-transform !duration-300">
                    <StoryPosterCard story={relatedStory} />
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryDetails;