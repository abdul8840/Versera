// src/components/Loading/BookLoading.jsx
import React from 'react';

const BookLoading = ({ size = 'md', text = 'Loading Stories...' }) => {
  const sizeClasses = {
    sm: 'w-16 h-20',
    md: 'w-24 h-32',
    lg: 'w-32 h-40',
    xl: 'w-40 h-48'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className="flex flex-col items-center justify-center !space-y-6">
      {/* Book Pages Opening Animation */}
      <div className={`${sizeClasses[size]} relative perspective-1000`}>
        {/* Book Cover */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-2xl transform rotate-y-0 transition-transform duration-1000 animate-bookOpen"></div>
        
        {/* Pages */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg transform rotate-y-0 transition-transform duration-800 animate-bookPage1"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg shadow-md transform rotate-y-0 transition-transform duration-600 animate-bookPage2"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-blue-300 rounded-lg shadow-sm transform rotate-y-0 transition-transform duration-400 animate-bookPage3"></div>
        <div className="absolute inset-0 bg-white rounded-lg transform rotate-y-0 transition-transform duration-200 animate-bookPage4"></div>
      </div>

      {/* Loading Text */}
      {text && (
        <div className="text-center">
          <p className={`${textSizes[size]} font-semibold text-gray-700 animate-pulse`}>
            {text}
          </p>
          <div className="flex !space-x-1 justify-center !mt-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Full Page Loading Component
export const BookLoadingPage = ({ text = 'Loading your stories...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <BookLoading size="xl" text={text} />
      </div>
    </div>
  );
};

// Grid Loading Component
export const BookLoadingGrid = ({ count = 6, text = 'Loading stories...' }) => {
  return (
    <div className="!space-y-8">
      <div className="text-center">
        <BookLoading size="md" text={text} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-50">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="bg-white/50 rounded-2xl shadow-lg !p-6 h-64 border border-gray-200 animate-pulse">
            <div className="w-full h-32 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg !mb-4"></div>
            <div className="h-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded !mb-3"></div>
            <div className="h-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded !mb-2"></div>
            <div className="h-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookLoading;