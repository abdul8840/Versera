import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../store/slices/categorySlice';
import { fetchTargetAudiences } from '../store/slices/targetAudienceSlice';
import { fetchStories } from '../store/slices/storySlice';
import StoryCard from '../components/Story/StoryCard';

const AllStories = () => {
    const dispatch = useDispatch();
    
    // Select state from all relevant Redux slices
    const { stories, loading: storiesLoading, error: storiesError, pagination } = useSelector((state) => state.story);
    const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.category);
    const { targetAudiences, loading: targetAudiencesLoading, error: targetAudiencesError } = useSelector((state) => state.targetAudience);

    // Local state for managing all filter values, now including targetAudience
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        search: '',
        category: '',
        targetAudience: '', // Added new filter state
        sort: '-publishedAt'
    });

    // Fetch static filter data (categories, audiences) only once when the component mounts
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchTargetAudiences()); // Fetch target audiences on load
    }, [dispatch]);

    // Fetch stories whenever any filter value changes
    useEffect(() => {
        dispatch(fetchStories(filters));
    }, [dispatch, filters]);

    // Generic handler for any change in filter inputs or select dropdowns
    const handleFilterChange = (e) => {
        setFilters({ 
            ...filters, 
            [e.target.name]: e.target.value, 
            page: 1 // Reset to page 1 on any filter change
        });
    };
    
    // Handler for submitting the search form
    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(fetchStories(filters));
    };

    // Handler for changing the page via pagination
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setFilters({ ...filters, page: newPage });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Explore Stories 🗺️</h1>

            {/* Filters and Search Bar Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end sticky top-20 z-10">
                
                {/* Search Input */}
                <form onSubmit={handleSearch} className="lg:col-span-2">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Stories</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            name="search"
                            id="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 px-3 py-2"
                            placeholder="Title, description, etc..."
                        />
                        <button
                            type="submit"
                            className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">All Genres</option>
                        {categories?.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    {categoriesError && <p className="text-xs text-red-500 mt-1">{categoriesError}</p>}
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
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">All Ages</option>
                        {targetAudiences?.map(audience => (
                            <option key={audience._id} value={audience._id}>{audience.title}</option>
                        ))}
                    </select>
                    {targetAudiencesError && <p className="text-xs text-red-500 mt-1">{targetAudiencesError}</p>}
                </div>
                
                {/* Sort Order Filter */}
                <div>
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700">Sort By</label>
                    <select
                        id="sort"
                        name="sort"
                        value={filters.sort}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
            {storiesLoading ? (
                <div className="flex justify-center mt-16">Loading...</div>
            ) : storiesError ? (
                <div className="text-center mt-16"><p className="text-red-600 bg-red-100 p-4 rounded-md">Error: {storiesError}</p></div>
            ) : (
                <>
                    {stories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {stories.map((story) => <StoryCard key={story._id} story={story} />)}
                        </div>
                    ) : (
                        <div className="text-center mt-16"><p className="text-gray-500 text-xl">No stories found matching your criteria.</p></div>
                    )}
                    
                    {/* Pagination */}
                    {pagination?.totalPages > 1 && (
                         <div className="flex justify-center items-center mt-12 space-x-2">
                            <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrev} className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                            <span className="px-4 py-2 text-gray-700">Page {pagination.currentPage} of {pagination.totalPages}</span>
                            <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNext} className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AllStories;