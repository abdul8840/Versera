import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowRight, FaPenFancy, FaBookReader, FaChevronLeft, FaChevronRight, FaStar, FaEye, FaHeart, FaFire } from 'react-icons/fa';
import { fetchStories } from '../../store/slices/storySlice';

const HeroSection = () => {
  const dispatch = useDispatch();
  const { stories, loading, error } = useSelector((state) => state.story);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch Top Stories
  useEffect(() => {
    dispatch(fetchStories({ sortBy: 'views', sortOrder: 'desc', limit: 5 }));
  }, [dispatch]);

  const topStories = Array.isArray(stories) ? stories.slice(0, 5) : [];

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || topStories.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topStories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, topStories.length]);

  const nextSlide = () => {
    if (topStories.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % topStories.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    if (topStories.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + topStories.length) % topStories.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-100 overflow-hidden flex items-center !pt-28 !pb-10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-r from-purple-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-r from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl animate-bounce animation-delay-1000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-purple-300/50 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative max-w-7xl !mx-auto !px-4 !py-8 w-full z-10">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
          {/* Left Column - Text Content */}
          <div className="text-left !space-y-6 lg:!space-y-8 animate-fade-in-up lg:w-1/2">
            {/* Premium Badge */}
            <div className="inline-flex items-center !space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white !px-4 !py-2 rounded-full shadow-lg">
              <FaFire className="text-orange-300 animate-pulse" />
              <span className="text-sm font-semibold">Premium Storytelling Platform</span>
            </div>

            {/* Main Heading */}
            <div className="!space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                  Versera
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-700 font-light leading-relaxed">
                Where <span className="text-purple-600 font-semibold">writers</span> create magic and{' '}
                <span className="text-indigo-600 font-semibold">readers</span> discover endless worlds
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              Join our vibrant community of storytellers and book lovers. Share your unique voice, 
              explore captivating narratives, and connect with fellow creative souls in a space 
              designed for literary excellence.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 !py-2">
              {[
                { icon: FaPenFancy, label: 'Active Writers', value: '10K+', color: 'text-purple-500' },
                { icon: FaBookReader, label: 'Daily Readers', value: '50K+', color: 'text-blue-500' },
                { icon: FaFire, label: 'Stories Published', value: '25K+', color: 'text-orange-500' }
              ].map((stat, index) => (
                <div key={index} className="flex items-center !space-x-3">
                  <stat.icon className={`text-2xl ${stat.color}`} />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 !pt-4">
              <Link
                to="/stories"
                className="inline-flex items-center justify-center !space-x-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white !px-8 !py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300 group"
              >
                <FaBookReader className="text-xl" />
                <span>Explore Stories</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center !space-x-3 bg-white text-purple-600 !px-8 !py-4 rounded-xl font-bold text-lg border-2 border-purple-600 shadow-lg hover:bg-purple-50 transform hover:scale-105 transition-all duration-300"
              >
                <FaPenFancy className="text-xl" />
                <span>Start Writing</span>
              </Link>
            </div>
          </div>

          {/* Right Column - Stories Slider */}
          <div className="relative h-96 lg:h-[500px] xl:h-[550px] animate-fade-in-up animation-delay-300 lg:w-1/2">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin !mx-auto !mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading amazing stories...</p>
                </div>
              </div>
            ) : error ? (
              <div className="w-full h-full flex items-center justify-center bg-red-50 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200">
                <div className="text-center text-red-600 !p-4">
                  <p className="font-semibold mb-2">Oops! Something went wrong</p>
                  <p className="text-sm">We couldn't load the top stories</p>
                </div>
              </div>
            ) : topStories.length > 0 ? (
              <div className="relative h-full flex items-center justify-center">
                {/* Top Stories Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white !px-6 !py-2 rounded-full text-sm font-bold shadow-lg z-50 flex items-center !space-x-2 whitespace-nowrap">
                  <FaFire className="animate-pulse" />
                  <span>🔥 Trending Stories</span>
                </div>

                {/* Story Cards Container */}
                <div className="relative w-full max-w-xs sm:max-w-sm h-[380px] lg:h-[420px] xl:h-[450px]">
                  {topStories.map((story, index) => {
                    if (!story?._id || !story.coverImage?.url) return null;

                    const position = (index - currentSlide + topStories.length) % topStories.length;
                    const isActive = position === 0;
                    const isNext = position === 1;
                    const isPrev = position === topStories.length - 1;
                    const zIndex = isActive ? 30 : (isNext || isPrev ? 20 : 10);

                    return (
                      <div
                        key={story._id}
                        className={`absolute top-0 left-0 w-full h-full transition-all duration-700 transform-gpu ${
                          isActive
                            ? 'scale-100 opacity-100 z-30'
                            : isNext || isPrev
                            ? 'scale-90 opacity-70 z-20 cursor-pointer'
                            : 'scale-75 opacity-30 z-10'
                        } ${
                          isNext
                            ? 'translate-x-20 lg:translate-x-24 xl:translate-x-28'
                            : isPrev
                            ? '-translate-x-20 lg:-translate-x-24 xl:-translate-x-28'
                            : 'translate-x-0'
                        }`}
                        style={{ zIndex }}
                        onClick={isNext ? nextSlide : (isPrev ? prevSlide : undefined)}
                      >
                        <Link
                          to={`/stories/${story._id}`}
                          onClick={(e) => !isActive && e.preventDefault()}
                          className={`block w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
                            isActive 
                              ? 'hover:scale-105 hover:shadow-3xl' 
                              : 'hover:opacity-90'
                          } border border-white/50`}
                          aria-hidden={!isActive}
                          tabIndex={isActive ? 0 : -1}
                        >
                          {/* Cover Image with Gradient Overlay */}
                          <div className="relative h-3/5 overflow-hidden">
                            <img
                              src={story.coverImage.url}
                              alt={story.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => { e.target.src = '/default-poster.jpg'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                            
                            {/* Rating Badge */}
                            {story.rating && (
                              <div className="absolute top-3 right-3 bg-black/70 text-white !px-2 !py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                                <FaStar className="inline text-yellow-400 !mr-1" />
                                {story.rating}
                              </div>
                            )}
                          </div>

                          {/* Story Info */}
                          <div className="!p-4 !space-y-3">
                            <h3 className="font-bold text-gray-900 text-lg lg:text-xl line-clamp-2 leading-tight">
                              {story.title || 'Untitled Story'}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-1">
                              by {story.author?.firstName || ''} {story.author?.lastName || 'Unknown Author'}
                            </p>
                            
                            {/* Stats */}
                            <div className="flex justify-between items-center !pt-2 text-sm">
                              <span className="inline-flex items-center !space-x-1 text-gray-500" title="Views">
                                <FaEye />
                                <span>{(story.views || 0).toLocaleString()}</span>
                              </span>
                              {typeof story.likesCount === 'number' && (
                                <span className="inline-flex items-center !space-x-1 text-red-500" title="Likes">
                                  <FaHeart />
                                  <span className="font-medium">{story.likesCount}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  aria-label="Previous Story"
                  className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-purple-600 !p-3 rounded-full hover:bg-white hover:shadow-lg transition-all duration-200 z-40 border border-gray-200 shadow-md"
                >
                  <FaChevronLeft className="text-lg" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Story"
                  className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-purple-600 !p-3 rounded-full hover:bg-white hover:shadow-lg transition-all duration-200 z-40 border border-gray-200 shadow-md"
                >
                  <FaChevronRight className="text-lg" />
                </button>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200">
                <div className="text-center text-gray-600 !p-6">
                  <FaBookReader className="text-4xl !mx-auto !mb-4 text-gray-400" />
                  <p className="font-semibold !mb-2">No Stories Yet</p>
                  <p className="text-sm">Be the first to share your story!</p>
                </div>
              </div>
            )}

            {/* Slide Indicators */}
            {topStories.length > 0 && !loading && !error && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex !space-x-2 z-40">
                {topStories.map((_, index) => (
                  <button
                    key={index}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-purple-600 w-6'
                        : 'bg-gray-400 hover:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add custom animations to your global CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;