// src/pages/AllStories.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../store/slices/categorySlice'; // Adjust path
import { fetchTargetAudiences } from '../store/slices/targetAudienceSlice'; // Adjust path
import { fetchStories } from '../store/slices/storySlice'; // Adjust path
import { fetchMyList } from '../store/slices/myListSlice'; // <-- 1. Import fetchMyList
import StoryPosterCard from '../components/Story/StoryPosterCard';

const AllStories = () => {
    const dispatch = useDispatch();
    
    // Select state from Redux store
    const { stories, loading: storiesLoading, error: storiesError, pagination } = useSelector((state) => state.story);
    const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.category);
    const { targetAudiences, loading: targetAudiencesLoading, error: targetAudiencesError } = useSelector((state) => state.targetAudience);
    // 3. Get user for fetching My List conditionally
    const { user, loading: authLoading } = useSelector((state) => state.auth); 

    // Local state for managing all filter values
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12, // Adjust limit if needed for poster cards (e.g., 18 or 24)
        search: '',
        category: '',
        targetAudience: '', 
        sort: '-publishedAt'
    });

    // Fetch static filter data (categories, audiences) only once when the component mounts
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchTargetAudiences());
        // 4. Fetch My List if user is logged in (needed for save icon status in poster card)
        if (user) {
            dispatch(fetchMyList());
        }
    }, [dispatch, user]); // Add user as dependency

    // Fetch stories whenever any filter value changes
    useEffect(() => {
        dispatch(fetchStories(filters));
    }, [dispatch, filters]);

    // Handler for filter changes
    const handleFilterChange = (e) => {
        setFilters({ 
            ...filters, 
            [e.target.name]: e.target.value, 
            page: 1 
        });
    };
    
    // Handler for submitting the search form
    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(fetchStories(filters));
    };

    // Handler for changing the page via pagination
    const handlePageChange = (newPage) => {
        if (newPage > 0 && pagination?.totalPages && newPage <= pagination.totalPages) {
            setFilters({ ...filters, page: newPage });
        }
    };
    
    // Determine overall loading state
    const isLoading = storiesLoading || categoriesLoading || targetAudiencesLoading || authLoading;

    return (
        // Added background gradient similar to MyListPage
        <div className="!min-h-screen !bg-gradient-to-br !from-purple-50 !via-white !to-green-50 !py-20 md:!py-20">
            <div className="!max-w-7xl !mx-auto !px-4"> {/* Increased max-width for more cards */}
                <h1 className="!text-3xl md:!text-4xl !font-bold !text-center !mb-10 !text-gray-800">Explore Stories 🗺️</h1>

                {/* Filters and Search Bar Section - Consider making it non-sticky if background is complex */}
                <div className="bg-white !p-4 rounded-lg shadow-md !mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end z-10">
                    
                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="lg:col-span-2">
                         <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Stories</label>
                         <div className="!mt-1 flex rounded-md shadow-sm">
                             <input
                                 type="text"
                                 name="search"
                                 id="search"
                                 value={filters.search}
                                 onChange={handleFilterChange}
                                 className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 !px-3 !py-2"
                                 placeholder="Title, description, etc..."
                             />
                             <button
                                 type="submit"
                                 className="-!ml-px relative inline-flex items-center !space-x-2 !px-4 !py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                             >
                                 <span>Search</span>
                             </button>
                         </div>
                    </form>

                    {/* Category Filter */}
                    <div>
                         <label htmlFor="category" className="block text-sm font-medium text-gray-700">Genre</label>
                         <select
                             id="category"
                             name="category"
                             value={filters.category}
                             onChange={handleFilterChange}
                             disabled={categoriesLoading}
                             className="!mt-1 block w-full !pl-3 !pr-10 !py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                         >
                             <option value="">All Genres</option>
                             {categories?.map(cat => (
                                 <option key={cat._id} value={cat._id}>{cat.name}</option>
                             ))}
                         </select>
                         {categoriesError && <p className="text-xs text-red-500 !mt-1">{categoriesError}</p>}
                    </div>

                    {/* Target Audience Filter */}
                    <div>
                         <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">Audience</label>
                         <select
                             id="targetAudience"
                             name="targetAudience"
                             value={filters.targetAudience}
                             onChange={handleFilterChange}
                             disabled={targetAudiencesLoading}
                             className="!mt-1 block w-full !pl-3 !pr-10 !py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                         >
                             <option value="">All Ages</option>
                             {targetAudiences?.map(audience => (
                                 <option key={audience._id} value={audience._id}>{audience.title}</option>
                             ))}
                         </select>
                         {targetAudiencesError && <p className="text-xs text-red-500 !mt-1">{targetAudiencesError}</p>}
                    </div>
                    
                    {/* Sort Order Filter */}
                    <div>
                         <label htmlFor="sort" className="block text-sm font-medium text-gray-700">Sort By</label>
                         <select
                             id="sort"
                             name="sort"
                             value={filters.sort}
                             onChange={handleFilterChange}
                             className="!mt-1 block w-full !pl-3 !pr-10 !py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                         >
                             <option value="-publishedAt">Newest First</option>
                             <option value="publishedAt">Oldest First</option>
                             <option value="title">Title (A-Z)</option>
                             <option value="-title">Title (Z-A)</option>
                             <option value="-views">Most Viewed</option>
                             <option value="-likesCount">Most Liked</option>
                         </select>
                    </div>
                </div>

                {/* Story Grid Section */}
                {isLoading ? (
                    <div className="!flex justify-center !mt-20">Loading...</div>
                ) : storiesError ? (
                    <div className="!text-center !mt-16"><p className="!text-red-600 !bg-red-100 !p-4 !rounded-md !max-w-md !mx-auto">Error: {storiesError}</p></div>
                ) : (
                    <>
                        {stories.length > 0 ? (
                            // 5. Updated grid columns for posters
                            <div className="max-w-6xl !mx-auto !grid !grid-cols-2 sm:!grid-cols-3 md:!grid-cols-4 lg:!grid-cols-5 xl:!grid-cols-6 !gap-6">
                                {stories.map((story) => (
                                   // 6. Use StoryPosterCard instead of StoryCard
                                   story ? <StoryPosterCard key={story._id} story={story} /> : null
                                ))}
                            </div>
                        ) : (
                            <div className="!text-center !mt-16 !py-10 !bg-white !rounded-lg !shadow-sm !max-w-lg !mx-auto !p-8">
                                <span className="!text-6xl">🤷</span>
                                <p className="!text-gray-600 !text-xl !mt-4 !font-semibold">No stories found</p>
                                <p className="!text-gray-500 !mt-2">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                        
                        {/* Pagination */}
                        {pagination?.totalPages > 1 && (
                             <div className="flex justify-center items-center !mt-12 !space-x-2">
                                <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrev} className="!px-4 !py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                                <span className="!px-4 !py-2 text-gray-700">Page {pagination.currentPage} of {pagination.totalPages}</span>
                                <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNext} className="!px-4 !py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllStories;