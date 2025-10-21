import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyList } from '../store/slices/myListSlice';
import StoryCard from '../components/Story/StoryCard';
import { Link } from 'react-router-dom';

const MyListPage = () => {
  const dispatch = useDispatch();
  const { stories, loading, error } = useSelector((state) => state.myList);
  
  useEffect(() => {
    // Fetch the list when the component mounts
    dispatch(fetchMyList());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">My Saved Stories Saved </h1>

      {loading && (
        <div className="flex justify-center mt-16">
          Loading...
        </div>
      )}

      {error && (
        <div className="text-center mt-16">
          <p className="text-red-600 bg-red-100 p-4 rounded-md">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {stories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {stories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>
          ) : (
            <div className="text-center mt-16">
              <p className="text-gray-500 text-xl">You haven't saved any stories yet.</p>
              <Link 
                to="/stories" 
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                Explore Stories
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyListPage;