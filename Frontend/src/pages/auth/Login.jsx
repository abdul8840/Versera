import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError, clearSuccess } from '../../store/slices/authSlice'; 
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa'; 
import { toast } from 'react-toastify'; 

const SimpleSpinner = ({ size = '4', color = 'white', classNameProp = '' }) => (
  <div className={`!w-${size} !h-${size} !border-2 !border-${color} !border-t-transparent !rounded-full !animate-spin ${classNameProp}`}></div>
);

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: reduxError, success, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (success && user) {
      toast.success("Login Successful! Redirecting...");
      let targetPath = '/dashboard'; 
      if (user.role === 'admin') {
        targetPath = '/admin/dashboard';
      } else if (user.role === 'writer') {
        targetPath = '/writer/dashboard';
      }
      
      const timer = setTimeout(() => {
          navigate(targetPath);
          dispatch(clearSuccess()); 
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [success, user, navigate, dispatch]);

  useEffect(() => {
    if (reduxError) {
      toast.error(reduxError);
      const timer = setTimeout(() => dispatch(clearError()), 50);
      return () => clearTimeout(timer);
    }
  }, [reduxError, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginClick = () => {
    if (!formData.email || !formData.password) {
        toast.error("Please enter both email and password.");
        return;
    }
    dispatch(loginUser(formData));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleLoginClick();
  };

  return (
    <div className="!min-h-screen !flex !items-center !justify-center !bg-gradient-to-br !from-purple-50 !via-white !to-indigo-50 !py-12 !px-4 sm:!px-6 lg:!px-8">
      <div className="!max-w-md !w-full !space-y-8 !bg-white !p-8 !rounded-xl !shadow-2xl">
        <div className="!text-center">
          {/* Logo Placeholder */}
          <div className="!mx-auto !h-12 !w-auto !text-purple-600">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="!w-12 !h-12 !mx-auto">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
             </svg>
          </div>
          <h2 className="!mt-4 !text-3xl !font-extrabold !text-gray-900">
            Sign in to Versera
          </h2>
          <p className="!mt-2 !text-sm !text-gray-600">
            Welcome back! Access your account.
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
                 id="email" name="email" type="email" required autoComplete="email"
                 className="!appearance-none !relative !block !w-full !pl-10 !pr-3 !py-2.5 !border !border-gray-300 !placeholder-gray-500 !text-gray-900 !rounded-md focus:!outline-none focus:!ring-purple-500 focus:!border-purple-500 sm:!text-sm"
                 placeholder="Email address"
                 value={formData.email} onChange={handleChange}
               />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="!sr-only">Password</label>
            <div className="!relative">
               <div className="!absolute !inset-y-0 !left-0 !pl-3 !flex !items-center !pointer-events-none">
                 <FaLock className="!h-5 !w-5 !text-gray-400" />
               </div>
               <input
                 id="password" name="password" type="password" required autoComplete="current-password"
                 className="!appearance-none !relative !block !w-full !pl-10 !pr-3 !py-2.5 !border !border-gray-300 !placeholder-gray-500 !text-gray-900 !rounded-md focus:!outline-none focus:!ring-purple-500 focus:!border-purple-500 sm:!text-sm"
                 placeholder="Password"
                 value={formData.password} onChange={handleChange}
               />
            </div>
          </div>

          <div className="!flex !items-center !justify-end">
            <div className="!text-sm">
              <Link
                to="/forgot-password"
                className="!font-medium !text-purple-600 hover:!text-purple-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleLoginClick} 
              disabled={loading}
              className="!group !relative !w-full !flex !justify-center !py-2.5 !px-4 !border !border-transparent !text-sm !font-medium !rounded-md !text-white !bg-purple-600 hover:!bg-purple-700 focus:!outline-none focus:!ring-2 focus:!ring-offset-2 focus:!ring-purple-500 disabled:!opacity-50 !transition cursor-pointer"
            >
              {loading ? (
                <SimpleSpinner size="5" color="white" classNameProp="!mr-2"/>
              ) : (
                 <FaSignInAlt className="!mr-2"/>
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="!text-center !text-sm !space-y-2">
            <p>
              <Link
                to="/register"
                className="!font-medium !text-purple-600 hover:!text-purple-500"
              >
                Don't have an account? Sign up
              </Link>
            </p>
            <p>
              <Link
                to="/admin/login"
                className="!font-medium !text-gray-600 hover:!text-gray-500"
              >
                Are you an Admin?
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;