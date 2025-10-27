import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600, 
  bgcolor: 'background.paper',
  border: '1px solid #ddd',
  boxShadow: 24,
  p: 4,
  borderRadius: 2, 
  maxHeight: '85vh',
  overflowY: 'auto', 
};

const UserDetailsModal = ({ user, open, handleClose }) => {
  if (!user) return null;

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'writer': return 'warning';
      case 'reader': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (isActive) => (isActive ? 'success' : 'default');

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="user-details-modal-title"
      aria-describedby="user-details-modal-description"
    >
      <Box sx={modalStyle}>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="user-details-modal-title" variant="h6" component="h2">
            User Details
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* User Info Section */}
        <Box display="flex" alignItems="center" mb={3} gap={2}>
           <Avatar 
             src={user.profilePicture || '/default-avatar.png'}
             alt={`${user.firstName} ${user.lastName}`}
             sx={{ width: 60, height: 60 }}
           />
           <Box>
             <Typography variant="h5" component="p" fontWeight="bold">
               {user.firstName} {user.lastName}
             </Typography>
             <Typography variant="body1" color="text.secondary">
               {user.email}
             </Typography>
           </Box>
        </Box>

        {/* Details Grid */}
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }} gap={2}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Role</Typography>
            <Chip label={user.role || 'N/A'} color={getRoleColor(user.role)} size="small" sx={{ textTransform: 'capitalize' }}/>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Status</Typography>
            <Chip label={user.isActive ? 'Active' : 'Inactive'} color={getStatusColor(user.isActive)} size="small" />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Joined On</Typography>
            <Typography variant="body2">{new Date(user.createdAt).toLocaleDateString('en-IN')}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">User ID</Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{user._id}</Typography>
          </Box>
           {/* Add more fields as needed */}
           {user.location && (
             <Box gridColumn="span 2">
               <Typography variant="caption" color="text.secondary" display="block">Location</Typography>
               <Typography variant="body2">{user.location}</Typography>
             </Box>
           )}
           {user.bio && (
             <Box gridColumn="span 2">
               <Typography variant="caption" color="text.secondary" display="block">Bio</Typography>
               <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{user.bio}</Typography>
             </Box>
           )}
        </Box>

      </Box>
    </Modal>
  );
};

export default UserDetailsModal;