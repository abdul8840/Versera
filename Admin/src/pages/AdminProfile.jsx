import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaEdit, FaCamera, FaCheckCircle, FaTimesCircle, FaUserShield, FaBirthdayCake, FaInfoCircle } from 'react-icons/fa';
import AdminLayout from '../components/Layout/AdminLayout';
import { getAdminProfile, clearError } from '../store/slices/authSlice';

const SimpleSpinner = ({ size = '8', color = 'purple-600' }) => (
  <div className={`!w-${size} !h-${size} !border-4 !border-${color} !border-t-transparent !rounded-full !animate-spin`}></div>
);

const Alert = ({ message, type = 'error', onClose }) => {
  const bgColor = type === 'error' ? '!bg-red-100 !border-red-300' : '!bg-green-100 !border-green-300';
  const textColor = type === 'error' ? '!text-red-700' : '!text-green-700';
  const iconColor = type === 'error' ? '!text-red-500' : '!text-green-500';
  const Icon = type === 'error' ? FaTimesCircle : FaCheckCircle;

  return (
    <div className={`!fixed !top-5 !right-5 !z-50 !max-w-sm !w-full !p-4 !border !rounded-md !shadow-lg ${bgColor} !flex !items-start !space-x-3`}>
      <Icon className={`!text-xl ${iconColor} !flex-shrink-0 !mt-0.5`} />
      <div className="!flex-1">
        <p className={`!text-sm !font-medium ${textColor}`}>{message}</p>
      </div>
      <button onClick={onClose} className={`!text-lg ${textColor} hover:!opacity-75`}>&times;</button>
    </div>
  );
};


const AdminProfile = () => {
  const dispatch = useDispatch();
  const { admin, loading, error, success } = useSelector((state) => state.auth); // Assuming success flag exists in authSlice

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      bio: '',
  });
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    if (!admin) {
      dispatch(getAdminProfile());
    }
  }, [dispatch, admin]);

  useEffect(() => {
    if (admin) {
      setFormData({
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        bio: admin.bio || '',
      });
    }
  }, [admin]);

   useEffect(() => {
     if (error) {
       const timer = setTimeout(() => {
         dispatch(clearError());
       }, 5000);
       return () => clearTimeout(timer);
     }
   }, [error, dispatch]);


  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting updated data:", formData);
    setIsEditing(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
       console.log("Uploading avatar:", file.name);
    }
  };

   const handleCoverUpload = (e) => {
     const file = e.target.files[0];
     if (file) {
        console.log("Uploading cover:", file.name);
     }
   };

  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };

  if (loading && !admin) {
    return (
      <AdminLayout>
        <div className="!flex !justify-center !items-center !min-h-[60vh]">
          <SimpleSpinner size="12" color="purple-600" />
        </div>
      </AdminLayout>
    );
  }

  if (!admin && !loading) {
    return (
      <AdminLayout>
         <div className="!bg-white !shadow-md !rounded-lg !p-6 !text-center">
            <h2 className="!text-xl !font-semibold !text-red-600 !mb-4">
              Could not load admin profile.
            </h2>
            <p className="!text-gray-600">
              Please try refreshing the page or logging in again.
            </p>
         </div>
      </AdminLayout>
    );
  }

  const profileData = admin || {};
  const dateOfBirthFormatted = profileData.dateOfBirth
    ? new Date(profileData.dateOfBirth).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Not Set';
  const joinedDateFormatted = profileData.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'N/A';

  return (
    <section>
      {error && <Alert message={error} type="error" onClose={handleCloseSnackbar} />}

      <div className="max-w-5xl !mx-auto bg-white shadow-md rounded-lg overflow-hidden !mb-6"> 
        {/* Cover Photo Area */}
        <div
            className={`!h-48 md:!h-56 !bg-cover !bg-center !relative ${profileData.coverPicture ? '' : '!bg-gradient-to-r !from-indigo-200 !to-purple-200'}`} 
            style={{ backgroundImage: `url(${profileData.coverPicture || ''})` }}
        >
             {!profileData.coverPicture && (
                <div className="!absolute !inset-0 !flex !items-center !justify-center !text-indigo-700 !opacity-50">
                    <FaCamera className="!text-4xl" />
                </div>
             )}
            <label
                htmlFor="cover-upload"
                title="Change Cover Photo"
                className={`!absolute !bottom-3 !right-3 !p-2 !rounded-full !cursor-pointer !transition ${
                    isEditing || uploadLoading
                        ? '!bg-gray-400 !text-gray-700 !cursor-not-allowed'
                        : '!bg-black/60 hover:!bg-black/80 !text-white'
                }`}
            >
                <FaCamera className="!w-4 !h-4" />
                <input
                    id="cover-upload"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={isEditing || uploadLoading}
                />
            </label>
            {uploadLoading && <SimpleSpinner size="5" color="white" classNameProp="!absolute !bottom-4 !right-4" />} 
        </div>

        {/* Profile Details Area */}
        <div className="!p-4 md:!p-6"> 
            <div className="!flex !flex-col !sm:flex-row !items-center !sm:items-end !mb-4 !-mt-16 sm:!-mt-14"> 
                <div className="!relative !mb-3 !sm:mb-0 !sm:mr-4 !flex-shrink-0">
                    <img
                        src={profileData.profilePicture || '/default-avatar.png'}
                        alt={`${profileData.firstName} ${profileData.lastName}`}
                        className="!w-28 !h-28 !md:w-32 !md:h-32 !rounded-full !object-cover !border-4 !border-white !shadow-md !bg-gray-300" 
                        onError={(e) => { e.target.src = '/default-avatar.png'; }}
                    />
                     <label
                        htmlFor="avatar-upload"
                        title="Change Profile Picture"
                        className={`!absolute !bottom-1 !right-1 !p-2 !rounded-full !cursor-pointer !transition ${
                            isEditing || uploadLoading
                                ? '!bg-gray-400 !text-gray-700 !cursor-not-allowed'
                                : '!bg-black/60 hover:!bg-black/80 !text-white'
                        }`}
                     >
                        <FaCamera className="!w-3 !h-3" />
                        <input
                            id="avatar-upload"
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            disabled={isEditing || uploadLoading}
                        />
                    </label>
                    {uploadLoading && <SimpleSpinner size="4" color="white" classNameProp="!absolute !bottom-2 !right-2" />}
                </div>
                <div className="!flex-grow !mb-1 !text-center !sm:text-left">
                    <h1 className="!text-2xl !md:text-3xl !font-bold !text-gray-900">
                        {profileData.firstName} {profileData.lastName}
                    </h1>
                    <p className="!text-gray-600 !text-sm !md:text-base">
                        {profileData.email}
                    </p>
                </div>
                 {!isEditing && (
                    <button
                        onClick={handleEditToggle}
                        className="!mt-3 !sm:mt-0 !inline-flex !items-center !px-4 !py-2 !border !border-gray-300 !rounded-md !shadow-sm !text-sm !font-medium !text-gray-700 !bg-white hover:!bg-gray-50 focus:!outline-none focus:!ring-2 focus:!ring-offset-2 focus:!ring-indigo-500 cursor-pointer"
                    >
                        <FaEdit className="!-ml-1 !mr-2 !h-4 !w-4" />
                        Edit Profile
                    </button>
                 )}
            </div>

            <hr className="!my-6 !border-gray-200"/>

            {/* View or Edit Mode */}
            {!isEditing ? (
                <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-x-6 !gap-y-4 !text-sm">
                     <div className="!flex !items-center">
                         <strong className="!w-24 !text-gray-500">Role:</strong>
                         <span className={`!inline-flex !items-center !px-2.5 !py-0.5 !rounded-full !text-xs !font-medium ${profileData.role === 'admin' ? '!bg-red-100 !text-red-800' : '!bg-gray-100 !text-gray-800'}`}>
                             <FaUserShield className="!mr-1"/> {profileData.role}
                         </span>
                     </div>
                     <div className="!flex !items-center">
                         <strong className="!w-24 !text-gray-500">Status:</strong>
                         <span className={`!inline-flex !items-center !px-2.5 !py-0.5 !rounded-full !text-xs !font-medium ${profileData.isActive ? '!bg-green-100 !text-green-800' : '!bg-gray-100 !text-gray-800'}`}>
                             {profileData.isActive ? 'Active' : 'Inactive'}
                         </span>
                     </div>
                     <div className="!flex !items-center">
                         <strong className="!w-24 !text-gray-500">Verified:</strong>
                         <span className={`!inline-flex !items-center !text-xs ${profileData.isVerified ? '!text-green-600' : '!text-yellow-600'}`}>
                            {profileData.isVerified ? <FaCheckCircle className="!mr-1"/> : <FaTimesCircle className="!mr-1"/>}
                            {profileData.isVerified ? 'Verified' : 'Not Verified'}
                         </span>
                     </div>
                     <div className="!flex !items-center">
                         <strong className="!w-24 !text-gray-500">Joined:</strong>
                         <span className="!text-gray-800">{joinedDateFormatted}</span>
                     </div>
                      <div className="!flex !items-center">
                         <strong className="!w-24 !text-gray-500">Birthday:</strong>
                         <span className="!text-gray-800"><FaBirthdayCake className="!inline !mr-1 !text-gray-400"/> {dateOfBirthFormatted}</span>
                     </div>
                     <div className="!flex !items-center !col-span-1 md:!col-span-2"> 
                        <strong className="!w-24 !text-gray-500">Admin ID:</strong>
                        <code className="!text-xs !text-gray-600 !bg-gray-100 !p-1 !rounded">{profileData._id}</code>
                     </div>
                     {/* Bio */}
                     <div className="!col-span-1 md:!col-span-2 !mt-2">
                        <strong className="!block !mb-1 !text-gray-500">
                            <FaInfoCircle className="!inline !mr-1 !text-gray-400"/> Bio:
                        </strong>
                        {profileData.bio?.trim() ? (
                            <p className="!text-gray-800 !leading-relaxed !whitespace-pre-wrap !p-3 !bg-gray-50 !rounded-md !border !border-gray-200">
                                {profileData.bio}
                            </p>
                        ) : (
                             <p className="!text-gray-500 !italic">Bio not provided.</p>
                        )}
                     </div>
                </div>
            ) : (
                // --- Edit Mode ---
                <form onSubmit={handleSubmit} noValidate className="!space-y-4">
                    <h3 className="!text-lg !font-semibold !text-gray-800 !mb-4 !border-b !pb-2">Edit Information</h3>
                    <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
                        <div>
                            <label htmlFor="firstName" className="!block !text-sm !font-medium !text-gray-700 !mb-1">First Name</label>
                            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required
                                className="!w-full !px-3 !py-2 !border !border-gray-300 !rounded-md !shadow-sm focus:!outline-none focus:!ring-indigo-500 focus:!border-indigo-500 sm:!text-sm" />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="!block !text-sm !font-medium !text-gray-700 !mb-1">Last Name</label>
                            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required
                                className="!w-full !px-3 !py-2 !border !border-gray-300 !rounded-md !shadow-sm focus:!outline-none focus:!ring-indigo-500 focus:!border-indigo-500 sm:!text-sm" />
                        </div>
                    </div>
                    <div>
                         <label htmlFor="bio" className="!block !text-sm !font-medium !text-gray-700 !mb-1">Bio</label>
                         <textarea id="bio" name="bio" rows="4" value={formData.bio} onChange={handleChange}
                            className="!w-full !px-3 !py-2 !border !border-gray-300 !rounded-md !shadow-sm focus:!outline-none focus:!ring-indigo-500 focus:!border-indigo-500 sm:!text-sm"
                            placeholder="A short description about yourself (optional)" />
                    </div>
                    {/* Add other inputs here */}
                    <div className="!flex !justify-end !space-x-3 !pt-4">
                        <button type="button" onClick={handleEditToggle} disabled={loading}
                            className="!px-4 !py-2 !border !border-gray-300 !rounded-md !shadow-sm !text-sm !font-medium !text-gray-700 !bg-white hover:!bg-gray-50 focus:!outline-none focus:!ring-2 focus:!ring-offset-2 focus:!ring-indigo-500 disabled:!opacity-50"
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="!inline-flex !justify-center !items-center !px-4 !py-2 !border !border-transparent !rounded-md !shadow-sm !text-sm !font-medium !text-white !bg-indigo-600 hover:!bg-indigo-700 focus:!outline-none focus:!ring-2 focus:!ring-offset-2 focus:!ring-indigo-500 disabled:!opacity-50"
                        >
                            {loading ? <SimpleSpinner size="4" color="white" classNameProp="!mr-2"/> : null}
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </section>
  );
};

export default AdminProfile;