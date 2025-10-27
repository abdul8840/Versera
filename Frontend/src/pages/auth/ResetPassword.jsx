import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword, clearError, clearSuccess } from '../../store/slices/authSlice';
import { FaLock, FaSync, FaSignInAlt } from 'react-icons/fa'; 
import { toast } from 'react-toastify'; 

const SimpleSpinner = ({ size = '4', color = 'white', classNameProp = '' }) => (
  <div className={`!w-${size} !h-${size} !border-2 !border-${color} !border-t-transparent !rounded-full !animate-spin ${classNameProp}`}></div>
);

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState(''); 
  const dispatch = useDispatch();
  const { token } = useParams(); 
  const navigate = useNavigate();
  const { loading, error: reduxError, success } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (reduxError) {
      setLocalError(''); 
      toast.error(reduxError);
      const timer = setTimeout(() => dispatch(clearError()), 50);
      return () => clearTimeout(timer);
    }
  }, [reduxError, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Password reset successfully! Redirecting to login...");
      const timer = setTimeout(() => {
        navigate('/login');
        dispatch(clearSuccess()); 
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (localError) setLocalError('');
  };

  const handleResetClick = () => {
    setLocalError(''); 

    if (!formData.password || !formData.confirmPassword) {
      setLocalError('Please enter and confirm your new password.');
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (!token) {
        setLocalError('Invalid or missing reset token. Please request a new link.');
        return;
    }

    dispatch(resetPassword({ token, password: formData.password }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleResetClick(); 
  };

  return (
    <div className="!min-h-screen !flex !items-center !justify-center !bg-gradient-to-br !from-purple-50 !via-white !to-indigo-50 !py-12 !px-4 sm:!px-6 lg:!px-8">
      <div className="!max-w-md !w-full !space-y-8 !bg-white !p-8 !rounded-xl !shadow-2xl">
        <div className="!text-center">
          {/* Logo Placeholder */}
          <div className="!mx-auto !h-12 !w-auto !text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="!w-12 !h-12 !mx-auto">
               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.566-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
            </svg>
          </div>
          <h2 className="!mt-4 !text-3xl !font-extrabold !text-gray-900">
            Set New Password
          </h2>
          <p className="!mt-2 !text-sm !text-gray-600">
            Please enter and confirm your new password below.
          </p>
        </div>

        {localError && (
          <div className="!bg-red-100 !border !border-red-400 !text-red-700 !px-4 !py-3 !rounded !relative" role="alert">
            <strong className="!font-bold">Error: </strong>
            <span className="!block sm:!inline">{localError}</span>
          </div>
        )}

        <form className="!mt-8 !space-y-6" onSubmit={handleSubmitForm}>
          <div>
            <label htmlFor="password" className="!sr-only">New Password</label>
             <div className="!relative">
                <div className="!absolute !inset-y-0 !left-0 !pl-3 !flex !items-center !pointer-events-none">
                  <FaLock className="!h-5 !w-5 !text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength="6"
                  className="!appearance-none !relative !block !w-full !pl-10 !pr-3 !py-2.5 !border !border-gray-300 !placeholder-gray-500 !text-gray-900 !rounded-md focus:!outline-none focus:!ring-purple-500 focus:!border-purple-500 sm:!text-sm"
                  placeholder="New Password (min. 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                />
             </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="!sr-only">Confirm New Password</label>
             <div className="!relative">
                <div className="!absolute !inset-y-0 !left-0 !pl-3 !flex !items-center !pointer-events-none">
                  <FaLock className="!h-5 !w-5 !text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="!appearance-none !relative !block !w-full !pl-10 !pr-3 !py-2.5 !border !border-gray-300 !placeholder-gray-500 !text-gray-900 !rounded-md focus:!outline-none focus:!ring-purple-500 focus:!border-purple-500 sm:!text-sm"
                  placeholder="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
             </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleResetClick}
              disabled={loading || success} 
              className="!group !relative !w-full !flex !justify-center !py-2.5 !px-4 !border !border-transparent !text-sm !font-medium !rounded-md !text-white !bg-purple-600 hover:!bg-purple-700 focus:!outline-none focus:!ring-2 focus:!ring-offset-2 focus:!ring-purple-500 disabled:!opacity-60 disabled:!cursor-not-allowed !transition cursor-pointer"
            >
              {loading ? (
                <SimpleSpinner size="5" color="white" classNameProp="!mr-2"/>
              ) : (
                 <FaSync className="!mr-2"/> 
              )}
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>

          <div className="!text-center !text-sm">
            <Link
              to="/login"
              className="!font-medium !text-purple-600 hover:!text-purple-500 !inline-flex !items-center !space-x-1"
            >
              <FaSignInAlt className="!w-3 !h-3"/>
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;