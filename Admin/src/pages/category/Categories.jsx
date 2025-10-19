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
  Image as ImageIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError,
  clearSuccess,
} from '../../store/slices/categorySlice';

const CategoryForm = ({ open, onClose, editCategory }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.category);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (editCategory) {
      setFormData({
        name: editCategory.name,
        description: editCategory.description,
        image: null,
      });
      setImagePreview(editCategory.image.url);
    } else {
      setFormData({
        name: '',
        description: '',
        image: null,
      });
      setImagePreview('');
    }
  }, [editCategory, open]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editCategory) {
      dispatch(updateCategory({ id: editCategory._id, categoryData: formData }))
        .unwrap()
        .then(() => {
          onClose();
        });
    } else {
      dispatch(createCategory(formData))
        .unwrap()
        .then(() => {
          onClose();
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editCategory ? 'Edit Category' : 'Create New Category'}
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
            name="name"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
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

          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="category-image"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="category-image">
              <Button
                variant="outlined"
                component="span"
                startIcon={<ImageIcon />}
                fullWidth
              >
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </Button>
            </label>
            
            {imagePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : editCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error, success } = useSelector((state) => state.category);
  
  const [formOpen, setFormOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(fetchCategories());
    }
  }, [success, dispatch]);

  const handleCreate = () => {
    setEditCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setFormOpen(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete._id));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditCategory(null);
  };

  const handleCloseSnackbar = () => {
    dispatch(clearError());
    dispatch(clearSuccess());
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Categories Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Category
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
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>
                    <img
                      src={category.image.url}
                      alt={category.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">{category.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {category.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category.isActive ? 'Active' : 'Inactive'}
                      color={category.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(category)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(category)}
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

      <CategoryForm
        open={formOpen}
        onClose={handleCloseForm}
        editCategory={editCategory}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the category "{categoryToDelete?.name}"?
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

export default Categories;