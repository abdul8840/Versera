// pages/Writer/WriterProfile.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WriterLayout from '../../components/Layout/WriterLayout';
import { updateProfile, uploadAvatar, uploadCover, clearError, clearSuccess, getMe } from '../../store/slices/authSlice';

const WriterProfile = () => {
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
    console.log('Current user data:', user);
    console.log('Loading state:', loading);
    
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
      console.log('Error:', error);
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      console.log('Success:', success);
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
    console.log('Submitting form data:', formData);
    const result = await dispatch(updateProfile(formData));
    console.log('Update result:', result);
    
    // If successful, exit edit mode
    if (result.type === 'auth/updateProfile/fulfilled') {
      setIsEditing(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Uploading avatar:', file);
      setUploadLoading(true);
      const result = await dispatch(uploadAvatar(file));
      console.log('Avatar upload result:', result);
      setUploadLoading(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Uploading cover:', file);
      setUploadLoading(true);
      const result = await dispatch(uploadCover(file));
      console.log('Cover upload result:', result);
      setUploadLoading(false);
    }
  };

  // Show loading state
  if (loading && !user) {
    return (
      <WriterLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </WriterLayout>
    );
  }

  if (!user) {
    return (
      <WriterLayout>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User not found</h2>
            <p className="text-gray-600">Please try refreshing the page or contact support.</p>
          </div>
        </div>
      </WriterLayout>
    );
  }

  return (
    <WriterLayout>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          {/* Temporary Debug Info - Remove this in production */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg border">
            <h3 className="font-semibold mb-2 text-gray-800">Debug User Data:</h3>
            <pre className="text-xs whitespace-pre-wrap text-gray-700">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Profile updated successfully!</p>
                </div>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Writer Profile</h1>
              <p className="text-gray-600 mt-1">Manage your profile information</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
              disabled={loading}
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>

          {!isEditing ? (
            /* VIEW MODE */
            <div className="space-y-8">
              {/* Cover Photo Section */}
              <div className="relative rounded-xl overflow-hidden">
                <div 
                  className="w-full h-64 bg-gradient-to-r from-blue-400 to-purple-500 bg-cover bg-center"
                  style={{ 
                    backgroundImage: user.coverPicture ? `url(${user.coverPicture})` : 'none'
                  }}
                >
                  {!user.coverPicture && (
                    <div className="w-full h-full flex items-center justify-center text-white text-lg">
                      Add a cover photo
                    </div>
                  )}
                </div>
                <label className="absolute bottom-4 right-4 bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg cursor-pointer hover:bg-opacity-100 transition shadow-lg font-medium">
                  {uploadLoading ? 'Uploading...' : '📷 Change Cover'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Profile Info Section */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={user.profilePicture || '/default-avatar.png'}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg">
                      {uploadLoading ? '⏳' : '📸'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={uploadLoading}
                      />
                    </label>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {user.firstName} {user.lastName}
                    </h2>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {user.role}
                      </span>
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                    
                    {user.bio && (
                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                      </div>
                    )}
                    
                    {user.location && (
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">📍</span>
                        {user.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-6 rounded-xl text-center border border-blue-100">
                  <p className="text-3xl font-bold text-blue-600 mb-2">{user.stats?.articlesCount || 0}</p>
                  <p className="text-blue-800 font-medium">Stories Published</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl text-center border border-green-100">
                  <p className="text-3xl font-bold text-green-600 mb-2">{user.stats?.followersCount || 0}</p>
                  <p className="text-green-800 font-medium">Followers</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl text-center border border-purple-100">
                  <p className="text-3xl font-bold text-purple-600 mb-2">{user.stats?.followingCount || 0}</p>
                  <p className="text-purple-800 font-medium">Following</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-xl text-center border border-yellow-100">
                  <p className="text-3xl font-bold text-yellow-600 mb-2">0</p>
                  <p className="text-yellow-800 font-medium">Total Likes</p>
                </div>
              </div>

              {/* Social Links Section */}
              {(user.socialLinks && Object.values(user.socialLinks).some(link => link)) ? (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Links</h3>
                  <div className="flex flex-wrap gap-4">
                    {user.socialLinks.website && (
                      <a 
                        href={user.socialLinks.website.startsWith('http') ? user.socialLinks.website : `https://${user.socialLinks.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition"
                      >
                        <span>🌐</span>
                        <span>Website</span>
                      </a>
                    )}
                    {user.socialLinks.twitter && (
                      <a 
                        href={`https://twitter.com/${user.socialLinks.twitter.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition"
                      >
                        <span>🐦</span>
                        <span>Twitter</span>
                      </a>
                    )}
                    {user.socialLinks.facebook && (
                      <a 
                        href={`https://facebook.com/${user.socialLinks.facebook}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition"
                      >
                        <span>📘</span>
                        <span>Facebook</span>
                      </a>
                    )}
                    {user.socialLinks.instagram && (
                      <a 
                        href={`https://instagram.com/${user.socialLinks.instagram.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-pink-300 hover:shadow-md transition"
                      >
                        <span>📷</span>
                        <span>Instagram</span>
                      </a>
                    )}
                    {user.socialLinks.linkedin && (
                      <a 
                        href={user.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition"
                      >
                        <span>💼</span>
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <p className="text-gray-600">No social links added yet.</p>
                </div>
              )}
            </div>
          ) : (
            /* EDIT MODE */
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell readers about yourself and your writing..."
                />
                <p className="text-sm text-gray-500 mt-2">Max 500 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Where are you from?"
                />
              </div>

              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Twitter
                    </label>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="username (without @)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Instagram
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="username (without @)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-8 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </WriterLayout>
  );
};

export default WriterProfile;