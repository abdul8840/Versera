// App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
import { initializeAuth } from './store/slices/authSlice';

// Components
import ProtectedRoute from './components/others/ProtectedRoute';
import PublicRoute from './components/others/PublicRoute';
import AppInitializer from './components/AppInitializer';

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
import ReaderProfile from './pages/reader/ReaderProfile';
import Header from './components/Layout/Header';
import AllStories from './pages/AllStories';
import StoryDetails from './pages/StoryDetails';
import MyListPage from './pages/MyListPage';
import CategoryDetails from './pages/CategoryDetails';

function AppContent() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
            <Home />
        } />

        <Route path="/stories" element={<AllStories />} />
        <Route path="/stories/:id" element={<StoryDetails />} />
        <Route path="/category/:categoryId" element={<CategoryDetails />} />

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

        <Route path="/reader/profile" element={
          <ProtectedRoute>
            <ReaderProfile />
          </ProtectedRoute>
        } />

        <Route path="/my-list" element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />

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

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <AppContent />
      </AppInitializer>
    </Provider>
  );
}

export default App;