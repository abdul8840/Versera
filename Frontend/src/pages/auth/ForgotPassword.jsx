import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, clearError, clearSuccess } from '../../store/slices/authSlice';
import { FaEnvelope, FaPaperPlane, FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify'; 

const SimpleSpinner = ({ size = '4', color = 'white', classNameProp = '' }) => (
  <div className={`!w-${size} !h-${size} !border-2 !border-${color} !border-t-transparent !rounded-full !animate-spin ${classNameProp}`}></div>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: reduxError, success } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (reduxError) {
      toast.error(reduxError);
      const timer = setTimeout(() => dispatch(clearError()), 50);
      return () => clearTimeout(timer);
    }
  }, [reduxError, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Password reset email sent! Please check your inbox (and spam folder).");

       const timer = setTimeout(() => dispatch(clearSuccess()), 50);
       return () => clearTimeout(timer);
    }
  }, [success, dispatch, navigate]); 

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendLinkClick = () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        toast.error('Please enter a valid email address.');
        return;
    }
    dispatch(forgotPassword(email));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleSendLinkClick(); 
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
            Reset Your Password
          </h2>
          <p className="!mt-2 !text-sm !text-gray-600">
            Enter the email address associated with your account, and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="!mt-8 !space-y-6" onSubmit={handleSubmitForm}>
          <div>
            <label htmlFor="email" className="!sr-only">Email Address</label>
             <div className="!relative">
               <div className="!absolute !inset-y-0 !left-0 !pl-3 !flex !items-center !pointer-events-none">
                 <FaEnvelope className="!h-5 !w-5 !text-gray-400" />
               </div>
               <input
                 id="email"
                 name="email"
                 type="email"
                 required
                 autoComplete="email"
                 className="!appearance-none !relative !block !w-full !pl-10 !pr-3 !py-2.5 !border !border-gray-300 !placeholder-gray-500 !text-gray-900 !rounded-md focus:!outline-none focus:!ring-purple-500 focus:!border-purple-500 sm:!text-sm"
                 placeholder="Enter your email address"
                 value={email}
                 onChange={handleChange}
               />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleSendLinkClick} 
              disabled={loading || success} 
              className="!group !relative !w-full !flex !justify-center !py-2.5 !px-4 !border !border-transparent !text-sm !font-medium !rounded-md !text-white !bg-purple-600 hover:!bg-purple-700 focus:!outline-none focus:!ring-2 focus:!ring-offset-2 focus:!ring-purple-500 disabled:!opacity-60 disabled:!cursor-not-allowed !transition cursor-pointer"
            >
              {loading ? (
                <SimpleSpinner size="5" color="white" classNameProp="!mr-2"/>
              ) : (
                 <FaPaperPlane className="!mr-2"/>
              )}
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </div>

          <div className="!text-center !text-sm">
            <Link
              to="/login"
              className="!font-medium !text-purple-600 hover:!text-purple-500 !inline-flex !items-center !space-x-1"
            >
              <FaSignInAlt className="!w-3 !h-3"/>
              <span>Remembered password? Back to Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;