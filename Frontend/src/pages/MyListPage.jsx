import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyList } from '../store/slices/myListSlice'; // Adjust path
import StoryPosterCard from '../components/Story/StoryPosterCard';
import { Link } from 'react-router-dom';

const MyListPage = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth); 
  const { stories, loading: myListLoading, error } = useSelector((state) => state.myList);
  
  useEffect(() => {
    if (!authLoading && user) { 
      dispatch(fetchMyList());
    }
  }, [dispatch, user, authLoading]); 

  const isLoading = authLoading || myListLoading; 

  return (
    <div className="!min-h-screen !bg-gradient-to-br !from-blue-50 !via-white !to-purple-50 !py-12 md:!py-20"> 
      <div className="!max-w-6xl !mx-auto !px-4"> 
        <h1 className="!text-3xl md:!text-4xl !font-bold !text-center !mb-10 !text-gray-800">My Saved Stories ❤️</h1>

        {isLoading && (
          <div className="!flex !justify-center !mt-20">
            ...
          </div>
        )}

        {!isLoading && error && (
          <div className="!text-center !mt-16">
            <p className="!text-red-600 !bg-red-100 !p-4 !rounded-md !max-w-md !mx-auto">
              <span className="!font-semibold">Error loading your list:</span> {error}
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {!user && !authLoading && (
                 <div className="!text-center !mt-16 !py-10 !bg-white !rounded-lg !shadow-md !max-w-lg !mx-auto !p-8">
                    <span className="!text-6xl">🔒</span>
                    <p className="!text-gray-600 !text-xl !mt-4 !font-semibold">Please Log In</p>
                    <p className="!text-gray-500 !mt-2">Log in to view your saved stories.</p>
                    <Link 
                      to="/login" 
                      className="!mt-6 !inline-block !bg-blue-600 !text-white !px-8 !py-3 !rounded-lg !font-semibold hover:!bg-blue-700 !transition-colors !shadow hover:!shadow-lg"
                    >
                      Go to Login
                    </Link>
                 </div>
            )}
            
            {user && (
              stories.length > 0 ? (
                <div className="!grid !grid-cols-2 sm:!grid-cols-3 md:!grid-cols-4 lg:!grid-cols-5 xl:!grid-cols-6 !gap-6">
                  {stories.map((story) => (
                    story ? <StoryPosterCard key={story._id} story={story} /> : null
                  ))}
                </div>
              ) : (
                <div className="!text-center !mt-16 !py-10 !bg-white !rounded-lg !shadow-md !max-w-lg !mx-auto !p-8">
                  <span className="!text-6xl">📚</span>
                  <p className="!text-gray-600 !text-xl !mt-4 !font-semibold">Your reading list is empty!</p>
                  <p className="!text-gray-500 !mt-2">Explore stories and save your favorites to read later.</p>
                  <Link 
                    to="/stories" 
                    className="!mt-6 !inline-block !bg-blue-600 !text-white !px-8 !py-3 !rounded-lg !font-semibold hover:!bg-blue-700 !transition-colors !shadow hover:!shadow-lg"
                  >
                    Explore Stories
                  </Link>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyListPage;