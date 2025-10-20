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
  Chip,
  TextField,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStories,
  updateStoryStatus,
  deleteStory,
  clearError,
  clearSuccess,
} from '../store/slices/storySlice'; // Adjust the import path to your slice

const Stories = () => {
  // 1. Connect to the Redux store to get state
  const dispatch = useDispatch();
  const { stories, loading, error, success, pagination } = useSelector((state) => state.story);

  // 2. Keep only the filters in local component state
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: '',
  });
  
  // 3. Dispatch the fetchStories action when filters change
  useEffect(() => {
    dispatch(fetchStories(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to page 1 on any filter change
    }));
  };

  const handlePageChange = (event, value) => {
    setFilters(prev => ({ ...prev, page: value }));
  };

  // 4. Dispatch the updateStoryStatus action
  const handleStatusChange = (storyId, newStatus) => {
    dispatch(updateStoryStatus({ id: storyId, status: newStatus }));
  };

  // 5. Dispatch the deleteStory action
  const handleDelete = (storyId) => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      dispatch(deleteStory(storyId));
    }
  };

  // 6. Use clearError and clearSuccess actions for the Snackbar
  const handleCloseSnackbar = () => {
    if (error) {
      dispatch(clearError());
    }
    if (success) {
      dispatch(clearSuccess());
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'default';
      case 'archived': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Stories Management
      </Typography>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || (success && 'Action completed successfully!')}
        </Alert>
      </Snackbar>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Search Stories"
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            label="Status"
            variant="outlined"
            size="small"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {loading && stories.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cover</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell>Likes</TableCell>
                  <TableCell>Published</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stories.map((story) => (
                  <TableRow key={story._id} hover>
                    <TableCell>
                      <Box
                        component="img"
                        src={story.coverImage?.url || 'https://via.placeholder.com/50'}
                        alt={story.title}
                        sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" noWrap sx={{ maxWidth: 250 }}>
                        {story.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {`${story.author?.firstName || ''} ${story.author?.lastName || 'N/A'}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={story.status}
                        onChange={(e) => handleStatusChange(story._id, e.target.value)}
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="published">Published</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                      </TextField>
                    </TableCell>
                    <TableCell>{story.views}</TableCell>
                    <TableCell>{story.likesCount}</TableCell>
                    <TableCell>
                      {story.publishedAt ? new Date(story.publishedAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small" /* onClick logic for view */>
                        <ViewIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={() => handleDelete(story._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {stories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography color="textSecondary">No stories found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {pagination?.totalPages > 1 && (
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

export default Stories;