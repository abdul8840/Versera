// src/components/Category/CategoriesSection.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../store/slices/categorySlice';
import { FaArrowRight, FaBookOpen } from 'react-icons/fa';
import { BookLoadingGrid } from '../others/BookLoading';

const CategoriesSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading, error } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/category/${categoryId}`, { 
      state: { categoryName } 
    });
  };

  if (loading) {
    return (
      <section className="!py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl !mx-auto px-4">
          <div className="text-center !mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent !mb-4">
              Explore Categories
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl m!x-auto">
              Discover stories that match your interests
            </p>
          </div>
          <BookLoadingGrid type="category" count={8} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="!py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl !mx-auto !px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg !p-8 max-w-md !mx-auto border border-red-100">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center !mx-auto !mb-4">
              <FaBookOpen className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-red-600 !mb-2">Unable to Load Categories</h3>
            <p className="text-gray-600 !mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchCategories())}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white !px-6 !py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="!py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full opacity-15 blur-lg animate-bounce"></div>
      </div>

      <div className="max-w-7xl !mx-auto !px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center !mb-12">
          <div className="inline-flex items-center !space-x-2 bg-white/80 backdrop-blur-sm !px-6 !py-3 rounded-full shadow-lg border border-white/20 !mb-6">
            <FaBookOpen className="text-purple-500 text-xl" />
            <span className="text-gray-700 font-semibold">Story Categories</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent !mb-4">
            Explore Worlds
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl !mx-auto leading-relaxed">
            Dive into captivating stories across diverse genres. From thrilling adventures to heartwarming tales, 
            discover your next favorite read in our carefully curated categories.
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 !mb-12">
            {categories.map((category) => (
              <div
                key={category._id}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
                onClick={() => handleCategoryClick(category._id, category.name)}
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative !p-6 z-10">
                  {/* Category Image */}
                  <div className="flex items-center justify-between !mb-4">
                    <div className="relative">
                      <div className="absolute -inset-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={category.image?.url || '/default-category.jpg'}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { 
                            e.target.src = '/default-category.jpg';
                          }}
                        />
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-4 transition-all duration-300">
                      <FaArrowRight className="text-purple-500 text-xl" />
                    </div>
                  </div>

                  {/* Category Name */}
                  <h3 className="text-xl font-bold text-gray-800 !mb-3 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed !mb-4 line-clamp-3">
                    {category.description}
                  </p>

                  {/* Hover Effect Border */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center !py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg !p-8 max-w-md !mx-auto border border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center !mx-auto mb-4">
                <FaBookOpen className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 !mb-2">No Categories Available</h3>
              <p className="text-gray-600 !mb-4">Check back later for new categories.</p>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center !space-y-4 sm:!space-y-0 sm:!space-x-6 bg-white/80 backdrop-blur-sm !px-8 !py-6 rounded-2xl shadow-lg border border-white/20">
            <div className="text-left">
              <h4 className="text-xl font-bold text-gray-800 !mb-1">Can't find what you're looking for?</h4>
              <p className="text-gray-600 text-sm">Explore all stories across every category</p>
            </div>
            <button
              onClick={() => navigate('/stories')}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white !px-6 !py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center !space-x-2"
            >
              <span>Browse All Stories</span>
              <FaArrowRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;