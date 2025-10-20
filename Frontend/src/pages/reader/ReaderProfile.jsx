// pages/reader/ReaderProfile.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReaderLayout from '../../components/Layout/ReaderLayout';
import { updateProfile, uploadAvatar, uploadCover, clearError, clearSuccess, getMe } from '../../store/slices/authSlice';

const ReaderProfile = () => {
  const { user, loading, error, success } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: ''
  });
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.socialLinks?.website || '',
        twitter: user.socialLinks?.twitter || '',
        facebook: user.socialLinks?.facebook || '',
        instagram: user.socialLinks?.instagram || '',
        linkedin: user.socialLinks?.linkedin || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(formData));
    if (result.type === 'auth/updateProfile/fulfilled') {
      setIsEditing(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadLoading(true);
      await dispatch(uploadAvatar(file));
      setUploadLoading(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadLoading(true);
      await dispatch(uploadCover(file));
      setUploadLoading(false);
    }
  };

  // Mock data for reader stats
  const readerStats = {
    storiesRead: 24,
    likesGiven: 156,
    commentsWritten: 42,
    writersFollowed: 8,
    readingTime: '45h',
    favoriteGenres: ['Fantasy', 'Mystery', 'Science Fiction'],
    currentlyReading: 'The Midnight Library',
    readingGoal: 50
  };

  if (loading && !user) {
    return (
      <ReaderLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </ReaderLayout>
    );
  }

  if (!user) {
    return (
      <ReaderLayout>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User not found</h2>
            <p className="text-gray-600">Please try refreshing the page or contact support.</p>
          </div>
        </div>
      </ReaderLayout>
    );
  }

  return (
    <ReaderLayout>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          {/* Success/Error Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700">Profile updated successfully!</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Reader Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {!isEditing ? (
            <div className="space-y-6">
              {/* Cover Photo */}
              <div className="relative">
                <div 
                  className="w-full h-48 bg-gray-200 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${user.coverPicture || '/default-cover.jpg'})` }}
                >
                  <label className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-opacity-70">
                    {uploadLoading ? 'Uploading...' : 'Change Cover'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Profile Header */}
              <div className="flex items-start space-x-6">
                <div className="relative -mt-16">
                  <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700">
                    {uploadLoading ? '...' : '✎'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploadLoading}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-green-600 font-medium capitalize">{user.role}</p>
                  {user.bio && <p className="text-gray-600 mt-2">{user.bio}</p>}
                  {user.location && (
                    <p className="text-gray-500 mt-1">📍 {user.location}</p>
                  )}
                </div>
              </div>

              {/* Reader Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{readerStats.storiesRead}</p>
                  <p className="text-blue-800">Stories Read</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{readerStats.likesGiven}</p>
                  <p className="text-green-800">Likes Given</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">{readerStats.commentsWritten}</p>
                  <p className="text-purple-800">Comments</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">{readerStats.writersFollowed}</p>
                  <p className="text-yellow-800">Writers Followed</p>
                </div>
              </div>

              {/* Reading Preferences */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Reading Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Currently Reading</p>
                    <p className="font-medium">{readerStats.currentlyReading}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reading Goal</p>
                    <p className="font-medium">{readerStats.storiesRead}/{readerStats.readingGoal} stories</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Favorite Genres</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {readerStats.favoriteGenres.map((genre, index) => (
                        <span key={index} className="bg-white px-2 py-1 rounded text-xs border">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Reading Time</p>
                    <p className="font-medium">{readerStats.readingTime}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {user.socialLinks && Object.values(user.socialLinks).some(link => link) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Social Links</h3>
                  <div className="flex space-x-4">
                    {user.socialLinks.website && (
                      <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        Website
                      </a>
                    )}
                    {user.socialLinks.twitter && (
                      <a href={`https://twitter.com/${user.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                        Twitter
                      </a>
                    )}
                    {user.socialLinks.facebook && (
                      <a href={`https://facebook.com/${user.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        Facebook
                      </a>
                    )}
                    {user.socialLinks.instagram && (
                      <a href={`https://instagram.com/${user.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                        Instagram
                      </a>
                    )}
                    {user.socialLinks.linkedin && (
                      <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tell us about your reading interests..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Where are you from?"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ReaderLayout>
  );
};

export default ReaderProfile;