import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';

// Components
import ProtectedRoute from './components/others/ProtectedRoute';
import PublicRoute from './components/others/PublicRoute';
import Layout from './components/Layout/Layout';

// Public Pages
import Home from './pages/Home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import VerifyOTP from './pages/auth/VerifyOTP';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Reader Pages
import ReaderDashboard from './pages/dashboard/ReaderDashboard';

// Writer Pages
import WriterDashboard from './pages/writer/Dashboard';
import StoriesList from './pages/writer/StoriesList';
import CreateStory from './pages/writer/CreateStory';
import EditStory from './pages/writer/EditStory';
import StoryDetail from './pages/writer/StoryDetail';
import WriterProfile from './pages/writer/WriterProfile';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/verify-otp" element={
            <PublicRoute>
              <VerifyOTP />
            </PublicRoute>
          } />
          
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          
          <Route path="/reset-password/:token" element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          } />

          {/* Reader Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ReaderDashboard />
            </ProtectedRoute>
          } />

          {/* Writer Routes */}
          <Route path="/writer/dashboard" element={
            <ProtectedRoute requiredRole="writer">
              <WriterDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/writer/stories" element={
            <ProtectedRoute requiredRole="writer">
              <StoriesList />
            </ProtectedRoute>
          } />
          
          <Route path="/writer/stories/create" element={
            <ProtectedRoute requiredRole="writer">
              <CreateStory />
            </ProtectedRoute>
          } />
          
          <Route path="/writer/stories/edit/:id" element={
            <ProtectedRoute requiredRole="writer">
              <EditStory />
            </ProtectedRoute>
          } />
          
          <Route path="/writer/stories/:id" element={
            <ProtectedRoute requiredRole="writer">
              <StoryDetail />
            </ProtectedRoute>
          } />

          <Route path="/writer/profile" element={
            <ProtectedRoute requiredRole="writer">
              <WriterProfile />
            </ProtectedRoute>
          } />
          <Route path="/writer/stories/:id" element={
            <ProtectedRoute requiredRole="writer">
              <StoryDetail />
            </ProtectedRoute>
          } />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;