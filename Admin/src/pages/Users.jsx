import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Chip, TextField, MenuItem, Pagination,
  CircularProgress, Alert, Snackbar, Avatar
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers, updateUser, deleteUser, clearError, clearSuccess,
} from '../store/slices/userSlice'; 
import UserDetailsModal from '../components/Admin/UserDetailsModal';
import ConfirmDeleteModal from '../components/Admin/ConfirmDeleteModal'; 

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error, success, pagination } = useSelector((state) => state.user);

  const [filters, setFilters] = useState({ page: 1, role: '', search: '' });

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (success) {
      dispatch(fetchUsers(filters));
    }
  }, [success, dispatch, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (event, value) => {
    setFilters(prev => ({ ...prev, page: value }));
  };

  const handleStatusToggle = (user) => {
    dispatch(updateUser({ id: user._id, userData: { isActive: !user.isActive } }));
  };

  const handleRoleChange = (user, newRole) => {
    dispatch(updateUser({ id: user._id, userData: { role: newRole } }));
  };

  const handleDelete = (user) => {
    setUserToDelete(user); 
    setIsConfirmModalOpen(true); 
  };

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setUserToDelete(null); 
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete._id));
    }
    handleCloseConfirmModal(); 
  };

  const handleCloseSnackbar = () => {
    if(error) dispatch(clearError());
    if(success) dispatch(clearSuccess());
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users Management
      </Typography>

      <Snackbar open={!!error || success} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {error || 'Operation completed successfully!'}
        </Alert>
      </Snackbar>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Search Name/Email"
            variant="outlined" size="small" value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select label="Role" variant="outlined" size="small"
            value={filters.role} onChange={(e) => handleFilterChange('role', e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="reader">Reader</MenuItem>
            <MenuItem value="writer">Writer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 'bold' } }}> 
                  <TableCell>Name</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Joined</TableCell>
                  <TableCell align="right">Actions</TableCell> 
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar
                            src={user.profilePicture || '/default-avatar.png'}
                            alt={user.firstName}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Typography variant="body1" fontWeight="medium" noWrap>
                             {user.firstName} {user.lastName}
                          </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{user.email}</TableCell>
                    <TableCell>
                      <TextField select size="small" value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        sx={{ minWidth: 100 }} SelectProps={{ sx: { textTransform: 'capitalize' } }} // Capitalize dropdown
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
                        clickable size="small"
                        sx={{ cursor: 'pointer', fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {new Date(user.createdAt).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell align="right"> 
                      <IconButton title="View Details" color="primary" size="small" onClick={() => handleViewClick(user)}>
                        <ViewIcon fontSize="small"/>
                      </IconButton>
                      <IconButton title="Delete User" color="error" size="small" onClick={() => handleDelete(user)}>
                        <DeleteIcon fontSize="small"/>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                   <TableRow>
                       <TableCell colSpan={6} align="center" sx={{ py: 4 }}>No users found matching your criteria.</TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {pagination?.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary" showFirstButton showLastButton
              />
            </Box>
          )}
        </>
      )}

      <UserDetailsModal
        user={selectedUser}
        open={isDetailsModalOpen}
        handleClose={handleCloseDetailsModal}
      />

      <ConfirmDeleteModal
        open={isConfirmModalOpen}
        handleClose={handleCloseConfirmModal}
        handleConfirm={handleConfirmDelete}
        userName={`${userToDelete?.firstName || ''} ${userToDelete?.lastName || ''}`}
      />
    </Box>
  );
};

export default Users;