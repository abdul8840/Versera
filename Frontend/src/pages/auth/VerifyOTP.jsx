import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyOTP, clearError, clearSuccess } from '../../store/slices/authSlice'; 
import { API_BASE_URL } from '../../components/others/BaseURL';
import { FaPaperPlane, FaRedo, FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify'; 

const SimpleSpinner = ({ size = '4', color = 'white', classNameProp = '' }) => (
  <div className={`!w-${size} !h-${size} !border-2 !border-${color} !border-t-transparent !rounded-full !animate-spin ${classNameProp}`}></div>
);

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, error: reduxError, success } = useSelector((state) => state.auth);

  const email = location.state?.email;
  const initialMessage = location.state?.message; 

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  useEffect(() => {
      if (initialMessage) {
          toast.info(initialMessage);
      }
  }, [initialMessage]);

  useEffect(() => {
    if (success) {
      toast.success("Email verified successfully! Redirecting to login...");
      const timer = setTimeout(() => {
        navigate('/login');
        dispatch(clearSuccess()); 
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [success, navigate, dispatch]);

  useEffect(() => {
      if (reduxError) {
          toast.error(reduxError);
          const timer = setTimeout(() => dispatch(clearError()), 50);
          return () => clearTimeout(timer);
      }
  }, [reduxError, dispatch]);


  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleVerifyClick = () => {
    if (!email) {
      toast.error("Email address is missing. Cannot verify OTP.");
      return;
    }
    if (otp.length !== 6) {
        toast.error("Please enter the complete 6-digit OTP.");
        return;
    }
    dispatch(verifyOTP({ email, otp }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleVerifyClick();
  };

  const handleResendOTP = async () => {
    if (!email) {
       toast.error("Email address is missing. Cannot resend OTP.");
       return;
    }
    setResendLoading(true); 
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }
      toast.success('New OTP sent to your email!');
    } catch (err) {
      toast.error(err.message || 'An error occurred while resending OTP.'); 
    } finally {
      setResendLoading(false); 
    }
  };

  if (!email) {
    return (
      <div className="!min-h-screen !flex !items-center !justify-center !bg-gray-100 !p-4">
        <div className="!text-center !bg-white !p-8 !rounded-lg !shadow-md !max-w-md !w-full">
          <h2 className="!text-2xl !font-bold !text-red-600">Error</h2>
          <p className="!mt-2 !text-gray-700">Required information is missing. Please start the registration process again.</p>
          <Link
            to="/register"
            className="!mt-4 !inline-block !bg-purple-600 !text-white !px-6 !py-2 !rounded-lg !font-semibold hover:!bg-purple-700 !transition"
          >
            Go to Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="!min-h-screen !flex !items-center !justify-center !bg-gradient-to-br !from-purple-50 !via-white !to-indigo-50 !py-12 !px-4 sm:!px-6 lg:!px-8">
      <div className="!max-w-md !w-full !space-y-8 !bg-white !p-8 !rounded-xl !shadow-2xl">
        <div className="!text-center">
          {/* Logo Placeholder */}
          <div className="!mx-auto !h-12 !w-auto !text-purple-600">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="!w-12 !h-12 !mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
             </svg>
          </div>
          <h2 className="!mt-4 !text-3xl !font-extrabold !text-gray-900">
            Verify Your Email
          </h2>
          <p className="!mt-2 !text-sm !text-gray-600">
            We've sent a 6-digit code to <strong className="!font-medium">{email}</strong>. Please enter it below.
          </p>
        </div>

        <form className="!mt-8 !space-y-6" onSubmit={handleSubmitForm}>
          <div>
            <label htmlFor="otp" className="!block !text-sm !font-medium !text-gray-700 !text-center !mb-2">
              Enter 6-Digit Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric" 
              required
              maxLength="6"
              minLength="6"
              value={otp}
              onChange={handleChange}
              className="!appearance-none !relative !block !w-full !px-3 !py-3 !border !border-gray-300 !placeholder-gray-400 !text-gray-900 !rounded-md focus:!outline-none focus:!ring-2 focus:!ring-purple-500 focus:!border-transparent !text-center !text-3xl !tracking-[0.5em]" 
              placeholder="------"
              autoComplete="one-time-code"
            />
          </div>

          <div>
            <button
              type="button" 
              onClick={handleVerifyClick} 
              disabled={loading || otp.length !== 6} 
              className="!group !relative !w-full !flex !justify-center !py-2.5 !px-4 !border !border-transparent !text-sm !font-medium !rounded-md !text-white !bg-purple-600 hover:!bg-purple-700 focus:!outline-none focus:!ring-2 focus:!ring-offset-2 focus:!ring-purple-500 disabled:!opacity-50 !transition cursor-pointer"
            >
              {loading ? (
                <SimpleSpinner size="5" color="white" classNameProp="!mr-2"/>
              ) : (
                 <FaPaperPlane className="!mr-2"/>
              )}
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>

          <div className="!text-center !text-sm !space-y-2">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading} 
              className="!font-medium !text-purple-600 hover:!text-purple-500 disabled:!opacity-50 !disabled:cursor-not-allowed !inline-flex !items-center !space-x-1"
            >
               {resendLoading ? <SimpleSpinner size="4" color="purple-600"/> : <FaRedo className="!w-3 !h-3"/>}
              <span>{resendLoading ? 'Sending...' : "Didn't receive code? Resend"}</span>
            </button>
            <p>
                <Link
                  to="/login"
                  className="!font-medium !text-gray-600 hover:!text-gray-500 !inline-flex !items-center !space-x-1"
                >
                  <FaSignInAlt className="!w-3 !h-3"/>
                  <span>Back to Login</span>
                </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;