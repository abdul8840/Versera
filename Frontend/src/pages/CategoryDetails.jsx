// src/components/Category/CategoryDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStories } from '../store/slices/storySlice';
import StoryPosterCard from '../components/Story/StoryPosterCard';
import { FaArrowLeft, FaBook, FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import BookLoading, { BookLoadingPage } from '../components/others/BookLoading';

const CategoryDetails = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const categoryName = location.state?.categoryName || 'Category';
  const { stories, loading, error, pagination } = useSelector((state) => state.story);
  
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isFiltering, setIsFiltering] = useState(false);

  // Find the current category from stories to get its image
  const currentCategory = stories
    .flatMap(story => story.categories || [])
    .find(cat => cat._id === categoryId);

  useEffect(() => {
    dispatch(fetchStories({ category: categoryId }));
  }, [categoryId, dispatch]);

  useEffect(() => {
    setIsFiltering(true);
    
    let results = stories.filter(story => 
      story.categories?.some(cat => cat._id === categoryId)
    );

    // Apply search filter
    if (searchTerm) {
      results = results.filter(story =>
        story.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'views':
        results.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'likes':
        results.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
        break;
      default:
        break;
    }

    // Simulate filtering delay for better UX
    const timer = setTimeout(() => {
      setFilteredStories(results);
      setIsFiltering(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [stories, categoryId, searchTerm, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('newest');
  };

  if (loading) {
    return <BookLoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 !pt-20">
      {/* Category Header with Image */}
      <div className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        {/* Background Image */}
        {currentCategory?.image?.url && (
          <div className="absolute inset-0 opacity-10">
            <img
              src={currentCategory.image.url}
              alt={categoryName}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
        
        <div className="max-w-6xl !mx-auto !px-4 !py-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Back Button and Title with Category Image */}
            <div className="flex items-center !space-x-4">
              <Link
                to="/"
                className="bg-white shadow-lg !p-3 rounded-xl text-gray-600 hover:text-purple-600 transition-colors duration-200 border border-gray-200"
              >
                <FaArrowLeft className="text-lg" />
              </Link>
              <div className="flex items-center !space-x-4">
                {/* Category Image */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl blur opacity-30"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={currentCategory?.image?.url || '/default-category.jpg'}
                      alt={categoryName}
                      className="w-full h-full object-cover"
                      onError={(e) => { 
                        e.target.src = '/default-category.jpg';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {categoryName}
                  </h1>
                  <p className="text-gray-600 !mt-2">
                    {isFiltering ? 'Filtering...' : `${filteredStories.length} ${filteredStories.length === 1 ? 'story' : 'stories'} found`}
                  </p>
                </div>
              </div>
            </div>

            {/* Filters - Always visible */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="!pl-10 !pr-4 !py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
                  disabled={isFiltering}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isFiltering}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="!pl-10 !pr-4 !py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-48 appearance-none"
                  disabled={isFiltering}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="views">Most Views</option>
                  <option value="likes">Most Likes</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(searchTerm || sortBy !== 'newest') && (
                <button
                  onClick={clearFilters}
                  className="!px-4 !py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                  disabled={isFiltering}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-6xl !mx-auto !px-4 !py-8">
        {error ? (
          <div className="text-center !py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg !p-8 max-w-md !mx-auto border border-red-100">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center !mx-auto !mb-4">
                <FaBook className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-red-600 !mb-2">Unable to Load Stories</h3>
              <p className="text-gray-600 !mb-4">{error}</p>
              <button
                onClick={() => dispatch(fetchStories({ category: categoryId }))}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white !px-6 !py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : isFiltering ? (
          <div className="text-center !py-12">
            <BookLoading size="lg" text="Applying filters..." />
          </div>
        ) : filteredStories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 !mb-8">
              {filteredStories.map(story => (
                <StoryPosterCard key={story._id} story={story} />
              ))}
            </div>

            {/* Load More Button (if needed) */}
            {pagination?.hasNext && (
              <div className="text-center !mt-8">
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white !px-8 !py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Load More Stories
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center !py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg !p-12 max-w-lg !mx-auto border border-gray-200">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center !mx-auto mb-6">
                <FaBook className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 !mb-3">No Stories Found</h3>
              <p className="text-gray-600 !mb-6">
                {searchTerm 
                  ? `No stories found matching "${searchTerm}" in ${categoryName}`
                  : `No stories available in ${categoryName} yet.`
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {searchTerm && (
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white !px-6 !py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Clear Search
                  </button>
                )}
                <Link
                  to="/stories"
                  className="bg-white text-gray-700 !px-6 !py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300"
                >
                  Browse All Stories
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetails;