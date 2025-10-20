import React from 'react';
import { Link } from 'react-router-dom';

const StoryCard = ({ story }) => {
  // A simple function to truncate text
  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <Link to={`/stories/${story._id}`} className="block">
        <img
          src={story.coverImage.url}
          alt={story.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{truncateText(story.title, 50)}</h3>
          <div className="flex items-center mb-3">
            <img
              src={story.author.profilePicture || 'https://via.placeholder.com/40'}
              alt={story.author.firstName}
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
            <span className="text-gray-600 text-sm">{`${story.author.firstName} ${story.author.lastName}`}</span>
          </div>
          <p className="text-gray-700 text-sm mb-4">
            {truncateText(story.description, 100)}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              <i className="fas fa-eye mr-1"></i> {story.views}
            </span>
            <span>
              <i className="fas fa-heart mr-1 text-red-500"></i> {story.likesCount}
            </span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {story.categories.length > 0 ? story.categories[0].name : 'General'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default StoryCard;