import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword, clearError, clearSuccess } from '../../store/slices/authSlice';
import Layout from '../../components/Layout/Layout';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const dispatch = useDispatch();
  const { token } = useParams();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      dispatch(clearError());
      return;
    }

    dispatch(resetPassword({ token, password: formData.password }));
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 !py-12 !px-4 sm:!px-6 lg:!px-8">
        <div className="max-w-md w-full !space-y-8">
          <div className="text-center">
            <h2 className="!mt-6 text-3xl font-extrabold text-gray-900">
              Reset Password
            </h2>
            <p className="!mt-2 text-sm text-gray-600">
              Enter your new password
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 !px-4 !py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 !px-4 !py-3 rounded">
              Password reset successfully! Redirecting to login...
            </div>
          )}

          <form className="!mt-8 !space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="!mt-1 appearance-none relative block w-full !px-3 !py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="New Password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="!mt-1 appearance-none relative block w-full !px-3 !py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center !py-2 !px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
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

export default ResetPassword;