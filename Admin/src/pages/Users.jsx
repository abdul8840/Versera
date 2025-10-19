import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  updateUser,
  deleteUser,
  clearError,
  clearSuccess,
} from '../store/slices/userSlice';

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error, success, pagination } = useSelector((state) => state.user);
  
  const [filters, setFilters] = useState({
    page: 1,
    role: '',
    search: '',
  });

  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (success) {
      dispatch(fetchUsers(filters));
    }
  }, [success, dispatch, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (event, value) => {
    setFilters(prev => ({ ...prev, page: value }));
  };

  const handleStatusToggle = (user) => {
    dispatch(updateUser({
      id: user._id,
      userData: { isActive: !user.isActive }
    }));
  };

  const handleRoleChange = (user, newRole) => {
    dispatch(updateUser({
      id: user._id,
      userData: { role: newRole }
    }));
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}?`)) {
      dispatch(deleteUser(user._id));
    }
  };

  const handleCloseSnackbar = () => {
    dispatch(clearError());
    dispatch(clearSuccess());
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'writer': return 'warning';
      case 'reader': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users Management
      </Typography>

      <Snackbar
        open={!!error || success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? 'error' : 'success'}
        >
          {error || 'Operation completed successfully!'}
        </Alert>
      </Snackbar>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <TextField
            select
            label="Role"
            variant="outlined"
            size="small"
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="reader">Reader</MenuItem>
            <MenuItem value="writer">Writer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {user.firstName} {user.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        sx={{ minWidth: 100 }}
                      >
                        <MenuItem value="reader">Reader</MenuItem>
                        <MenuItem value="writer">Writer</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        color={user.isActive ? 'success' : 'default'}
                        onClick={() => handleStatusToggle(user)}
                        clickable
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small">
                        <ViewIcon />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => handleDelete(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Users;