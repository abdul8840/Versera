import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';

// Components
import ProtectedRoute from './components/others/ProtectedRoute';
import AdminLayout from './components/Layout/AdminLayout';

// Pages
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/AdminDashboard';
import Users from './pages/Users';
import Categories from './pages/category/Categories';
import TargetAudience from './pages/targetAudiance/TargetAudience';
import Stories from './pages/Stories';
import Writers from './pages/Writers';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#64748b',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="users" element={<Users />} />
                      <Route path="writers" element={<Writers />} />
                      <Route path="stories" element={<Stories />} />
                      <Route path="categories" element={<Categories />} />
                      <Route path="target-audience" element={<TargetAudience />} />
                      <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/admin/login" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;