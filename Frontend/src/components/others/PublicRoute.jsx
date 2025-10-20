// components/others/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Only redirect if authentication check is complete and user is authenticated
  if (isAuthenticated) {
    // Redirect based on user role
    if (user?.role === 'writer') {
      return <Navigate to="/writer/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default PublicRoute;