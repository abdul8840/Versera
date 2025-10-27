import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import { Close as CloseIcon, WarningAmber as WarningIcon } from '@mui/icons-material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 450, 
  bgcolor: 'background.paper',
  border: '1px solid #ddd',
  boxShadow: 24,
  p: 3, 
  borderRadius: 2,
};

const ConfirmDeleteModal = ({ open, handleClose, handleConfirm, userName }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-delete-modal-title"
      aria-describedby="confirm-delete-modal-description"
    >
      <Box sx={modalStyle}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
             <WarningIcon color="error" />
             <Typography id="confirm-delete-modal-title" variant="h6" component="h2" fontWeight="bold">
               Confirm Deletion
             </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Confirmation Message */}
        <Typography id="confirm-delete-modal-description" sx={{ mt: 2, mb: 3 }}>
          Are you sure you want to permanently delete the user{' '}
          <strong>{userName || 'this user'}</strong>? This action cannot be undone.
        </Typography>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirm}>
            Delete User
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteModal;