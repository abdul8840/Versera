import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTargetAudiences,
  createTargetAudience,
  updateTargetAudience,
  deleteTargetAudience,
  clearError,
  clearSuccess,
} from '../../store/slices/targetAudienceSlice';

const TargetAudienceForm = ({ open, onClose, editAudience }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.targetAudience);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minAge: '',
  });

  useEffect(() => {
    if (editAudience) {
      setFormData({
        title: editAudience.title,
        description: editAudience.description,
        minAge: editAudience.minAge,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        minAge: '',
      });
    }
  }, [editAudience, open]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editAudience) {
      dispatch(updateTargetAudience({ 
        id: editAudience._id, 
        audienceData: formData 
      }))
        .unwrap()
        .then(() => {
          onClose();
        });
    } else {
      dispatch(createTargetAudience(formData))
        .unwrap()
        .then(() => {
          onClose();
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editAudience ? 'Edit Target Audience' : 'Create New Target Audience'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title (e.g., 13+, 16+, 18+)"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            required
          />
          
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
          />

          <TextField
            margin="dense"
            name="minAge"
            label="Minimum Age"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.minAge}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : editAudience ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const TargetAudience = () => {
  const dispatch = useDispatch();
  const { targetAudiences, loading, error, success } = useSelector((state) => state.targetAudience);
  
  const [formOpen, setFormOpen] = useState(false);
  const [editAudience, setEditAudience] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [audienceToDelete, setAudienceToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchTargetAudiences());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(fetchTargetAudiences());
    }
  }, [success, dispatch]);

  const handleCreate = () => {
    setEditAudience(null);
    setFormOpen(true);
  };

  const handleEdit = (audience) => {
    setEditAudience(audience);
    setFormOpen(true);
  };

  const handleDelete = (audience) => {
    setAudienceToDelete(audience);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (audienceToDelete) {
      dispatch(deleteTargetAudience(audienceToDelete._id));
      setDeleteDialogOpen(false);
      setAudienceToDelete(null);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditAudience(null);
  };

  const handleCloseSnackbar = () => {
    dispatch(clearError());
    dispatch(clearSuccess());
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Target Audience Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Target Audience
        </Button>
      </Box>

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

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Minimum Age</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {targetAudiences.map((audience) => (
                <TableRow key={audience._id}>
                  <TableCell>
                    <Typography variant="subtitle1">{audience.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {audience.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{audience.minAge}+</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={audience.isActive ? 'Active' : 'Inactive'}
                      color={audience.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(audience)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(audience)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TargetAudienceForm
        open={formOpen}
        onClose={handleCloseForm}
        editAudience={editAudience}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the target audience "{audienceToDelete?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TargetAudience;