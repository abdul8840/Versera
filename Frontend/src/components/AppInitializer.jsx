// components/AppInitializer.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../store/slices/authSlice';

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return children;
};

export default AppInitializer;