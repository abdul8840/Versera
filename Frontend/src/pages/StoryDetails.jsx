import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoryById, clearCurrentStory } from '../store/slices/storySlice';
// import Spinner from '../components/ui/Spinner';
import StoryCard from '../components/Story/StoryCard'; // Re-use the card for related stories

const StoryDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentStory: story, loading, error } = useSelector((state) => state.story);
  // Assuming you have a way to fetch related stories
  const { stories: allStories } = useSelector((state) => state.story);

  useEffect(() => {
    if (id) {
      dispatch(fetchStoryById(id));
    }
    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentStory());
    };
  }, [id, dispatch]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!story) return <p className="text-center text-gray-500 mt-10">Story not found.</p>;

  // Simple logic for related stories (can be improved with a dedicated API endpoint)
  const relatedStories = allStories
    .filter(s => s._id !== story._id && s.categories.some(cat => story.categories.find(sc => sc._id === cat._id)))
    .slice(0, 4); // Show up to 4 related stories

  return (
    <div className="bg-gray-50">
      {/* Banner Image */}
      <div className="w-full h-64 md:h-96 bg-cover bg-center" style={{ backgroundImage: `url(${story.bannerImage.url})` }}>
        <div className="bg-black bg-opacity-50 w-full h-full flex items-center justify-center">
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 md:flex md:space-x-8 -mt-24">
        {/* Left Column: Cover & Meta */}
        <aside className="md:w-1/3 lg:w-1/4">
          <div className="sticky top-24">
            <img src={story.coverImage.url} alt={story.title} className="rounded-lg shadow-lg w-full mb-6" />
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">{story.title}</h2>
                <div className="space-y-3 text-gray-600">
                    <div className="flex items-center">
                        <i className="fas fa-user-circle mr-3 text-xl"></i>
                        <span>By {story.author.firstName} {story.author.lastName}</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-eye mr-3 text-xl"></i>
                        <span>{story.views} Views</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-heart mr-3 text-xl text-red-500"></i>
                        <span>{story.likesCount} Likes</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-calendar-alt mr-3 text-xl"></i>
                        <span>Published: {new Date(story.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-book-open mr-3 text-xl"></i>
                        <span>{story.targetAudience.title}</span>
                    </div>
                    <div className="pt-2">
                        <h4 className="font-semibold mb-2">Categories:</h4>
                        <div className="flex flex-wrap gap-2">
                            {story.categories.map(cat => (
                                <span key={cat._id} className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{cat.name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Story Content & Author */}
        <main className="md:w-2/3 lg:w-3/4 mt-8 md:mt-0">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2">Description</h3>
            <p className="text-gray-700 mb-6 italic">{story.description}</p>
            <hr className="my-6" />
            <h3 className="text-xl font-bold mb-4">Story</h3>
            {/* Render HTML content safely if it's from a rich text editor */}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: story.content }}></div>
          </div>

          {/* Author Box */}
          <div className="bg-white p-6 mt-8 rounded-lg shadow-sm flex items-center">
            <img src={story.author.profilePicture || 'https://via.placeholder.com/100'} alt={story.author.firstName} className="w-20 h-20 rounded-full object-cover mr-6" />
            <div>
              <h4 className="text-lg font-semibold">About {story.author.firstName} {story.author.lastName}</h4>
              <p className="text-gray-600 mt-1">{story.author.bio || 'No bio available.'}</p>
              {/* <Link to={`/authors/${story.author._id}`} className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">View Profile</Link> */}
            </div>
          </div>
        </main>
      </div>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Related Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedStories.map(relatedStory => (
                    <StoryCard key={relatedStory._id} story={relatedStory} />
                ))}
            </div>
          </div>
      )}
    </div>
  );
};

export default StoryDetails;