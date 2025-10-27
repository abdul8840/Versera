import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError, clearSuccess } from '../../store/slices/authSlice'; 
import { FaUser, FaLock, FaEnvelope, FaCalendarAlt, FaUserTag } from 'react-icons/fa'; 
import { toast } from 'react-toastify'; 
const SimpleSpinner = ({ size = '4', color = 'white', classNameProp = '' }) => (
  <div className={`!w-${size} !h-${size} !border-2 !border-${color} !border-t-transparent !rounded-full !animate-spin ${classNameProp}`}></div>
);


const Register = () => {
  const [step, setStep] = useState(1); 
  const [localError, setLocalError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    role: 'reader'
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: reduxError, success } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (reduxError) {
      setLocalError(reduxError);
      const timer = setTimeout(() => dispatch(clearError()), 50);
      return () => clearTimeout(timer);
    }
  }, [reduxError, dispatch]);

  useEffect(() => {
    if (success && step === 2) {
      navigate('/verify-otp', {
        state: {
          email: formData.email,
          message: 'Registration successful! Please check your email for the OTP code.'
        }
      });
      const timer = setTimeout(() => dispatch(clearSuccess()), 50);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, formData.email, dispatch, step]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (localError) setLocalError('');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setLocalError('');
    if (!formData.email) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setLocalError('Please enter a valid email address.');
        return;
    }
    if (!formData.password || !formData.confirmPassword) {
      setLocalError('Please enter and confirm your password.');
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
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

     if (!formData.firstName || !formData.lastName) {
       setLocalError('Please enter your first and last name.');
       return;
     }
     if (!formData.dateOfBirth) {
       setLocalError('Please enter your date of birth.');
       return;
     }
    const { confirmPassword, ...submitData } = formData;
    dispatch(registerUser(submitData));
  };

  const currentSubmitHandler = step === 1 ? handleNextStep : handleSubmit;

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
            {step === 1 ? 'Sign Up for Versera' : 'Complete Your Profile'}
          </h2>
          <p className="!mt-2 !text-sm !text-gray-600">
             {step === 1 ? 'Start by creating your login.' : 'Tell us a bit about yourself.'}
          </p>
        </div>

        {(localError || reduxError) && (
          <div className="!bg-red-100 !border !border-red-400 !text-red-700 !px-4 !py-3 !rounded !relative" role="alert">
            <strong className="!font-bold">Error: </strong>
            <span className="!block sm:!inline">{localError || reduxError}</span>
          </div>
        )}

        <form className="!mt-8 !space-y-6" onSubmit={currentSubmitHandler}>

          {step === 1 && (
            <>
              <div>
                <label htmlFor="email" className="!sr-only">Email Address</label>
                <div className="!relative">
                   <div className="!absolute !inset-y-0 !left-0 !pl-3 !flex !items-center !pointer-events-none">
                     <FaEnvelope className="!h-5 !w-5 !text-gray-400" />
                   </div>
                   <input
                     id="email" name="email" type="email" required
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
                      id="password" name="password" type="password" required minLength="6"
                      className="!appearance-none !relative !block !w-full !pl-10 !pr-3 !py-2.5 !border !border-gray-300 !placeholder-gray-500 !text-gray-900 !rounded-md focus:!outline-none focus:!ring-purple-500 focus:!border-purple-500 sm:!text-sm"
                      placeholder="Password (min. 6 characters)"
                      value={formData.password} onChange={handleChange}
                    />
                 </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="!sr-only">Confirm Password</label>
                 <div className="!relative">
                    <div className="!absolute !inset-y-0 !left-0 !pl-3 !flex !items-center !pointer-events-none">
                      <FaLock className="!h-5 !w-5 !text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword" name="confirmPassword" type="password" required
                      className="!appearance-none !relative !block !w-full !pl-10 !pr-3 !py-2.5 !border !border-gray-300 !placeholder-gray-500 !text-gray-900 !rounded-md focus:!outline-none focus:!ring-purple-500 focus:!border-purple-500 sm:!text-sm"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword} onChange={handleChange}
                    />
                 </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="!grid !grid-cols-2 !gap-4">
                <div>
                  <label htmlFor="firstName" className="!block !text-sm !font-medium !text-gray-700">First Name</label>
                  <input
                    id="firstName" name="firstName" type="text" required
                    className="!mt-1 !appearance-none !relative !block !w-full !px-3 !py-2 !border !border-gray-300 !placeholder-gray-500 !text-gray-900 !rounded-md focus:!outline-none focus:!ring-purple-500 focus:!border-purple-500 sm:!text-sm"
                    placeholder="First Name"
                    value={formData.firstName} onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="!block !text-sm !font-medium !text-gray-700">Last Name</label>
                  <input
                    id="lastName" name="lastName" type="text" required
                    className="!mt-1 !appearance-none !relative !block !w-full !px-3 !py-2 !border !border-gray-300 !placeholder-gray-500 !text-gray-900 !rounded-md focus:!outline-none focus:!ring-purple-500 focus:!border-purple-500 sm:!text-sm"
                    placeholder="Last Name"
                    value={formData.lastName} onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="!block !text-sm !font-medium !text-gray-700">Date of Birth</label>
                <div className="!relative !mt-1">
                   <div className="!absolute !inset-y-0 !left-0 !pl-3 !flex !items-center !pointer-events-none">
                      <FaCalendarAlt className="!h-5 !w-5 !text-gray-400" />
                   </div>
                   <input
                     id="dateOfBirth" name="dateOfBirth" type="date" required
                     className="!appearance-none !relative !block !w-full !pl-10 !pr-3 !py-2.5 !border !border-gray-300 !placeholder-gray-500 !text-gray-900 !rounded-md focus:!outline-none focus:!ring-purple-500 focus:!border-purple-500 sm:!text-sm"
                     value={formData.dateOfBirth} onChange={handleChange}
                   />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="!block !text-sm !font-medium !text-gray-700">I want to join as</label>
                 <div className="!relative !mt-1">
                    <div className="!absolute !inset-y-0 !left-0 !pl-3 !flex !items-center !pointer-events-none">
                       <FaUserTag className="!h-5 !w-5 !text-gray-400" />
                    </div>
                    <select
                      id="role" name="role" required
                      className="!appearance-none !block !w-full !pl-10 !pr-10 !py-2.5 !text-base !border !border-gray-300 focus:!outline-none focus:!ring-purple-500 focus:!border-purple-500 !rounded-md sm:!text-sm"
                      value={formData.role} onChange={handleChange}
                    >
                      <option value="reader">Reader</option>
                      <option value="writer">Writer</option>
                    </select>
                    <div className="!pointer-events-none !absolute !inset-y-0 !right-0 !flex !items-center !px-2 !text-gray-700">
                       <svg className="!fill-current !h-4 !w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                 </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="!mt-2 !text-sm !font-medium !text-purple-600 hover:!text-purple-500"
              >
                &larr; Go Back
              </button>
            </>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="!group !relative !w-full !flex !justify-center !py-2.5 !px-4 !border !border-transparent !text-sm !font-medium !rounded-md !text-white !bg-purple-600 hover:!bg-purple-700 focus:!outline-none focus:!ring-2 focus:!ring-offset-2 focus:!ring-purple-500 disabled:!opacity-50 !transition cursor-pointer"
            >
              {loading ? (
                <SimpleSpinner size="5" color="white" classNameProp="!mr-2"/>
              ) : null}
              {step === 1 ? 'Sign Up & Continue' : 'Create Account'}
            </button>
          </div>

          <div className="!text-center !text-sm">
            <Link
              to="/login"
              className="!font-medium !text-purple-600 hover:!text-purple-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;