import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyOTP, clearError, clearSuccess } from '../../store/slices/authSlice';
import Layout from '../../components/Layout/Layout';
import { API_BASE_URL } from '../../components/others/BaseURL';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);

  const email = location.state?.email;

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      dispatch(clearSuccess());
    }
  }, [success, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      dispatch(clearError());
      return;
    }
    dispatch(verifyOTP({ email, otp }));
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      alert('New OTP sent to your email');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!email) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <p className="mt-2">Email not found. Please register again.</p>
            <Link to="/register" className="text-primary-600 hover:text-primary-500">
              Go to Registration
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verify Your Email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a 6-digit OTP to {email}
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Email verified successfully! Redirecting to login...
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength="6"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-center text-2xl tracking-widest"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Didn't receive OTP? Resend
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyOTP;