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
  Button,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStories: 0,
  });

  useEffect(() => {
    fetchStories();
  }, [filters]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/stories?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStories(data.stories);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch stories');
      }
    } catch (error) {
      setError('Error fetching stories');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (event, value) => {
    setFilters(prev => ({ ...prev, page: value }));
  };

  const handleStatusChange = async (storyId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/stories/${storyId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Story status updated successfully');
        fetchStories();
      } else {
        setError(data.message || 'Failed to update story status');
      }
    } catch (error) {
      setError('Error updating story status');
    }
  };

  const handleDelete = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`/api/admin/stories/${storyId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setSuccess('Story deleted successfully');
          fetchStories();
        } else {
          setError(data.message || 'Failed to delete story');
        }
      } catch (error) {
        setError('Error deleting story');
      }
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
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
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? 'error' : 'success'}
        >
          {error || success}
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
            sx={{ minWidth: 200 }}
          />
          <TextField
            select
            label="Status"
            variant="outlined"
            size="small"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
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
                  <TableCell>Cover</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Categories</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell>Likes</TableCell>
                  <TableCell>Published</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stories.map((story) => (
                  <TableRow key={story._id}>
                    <TableCell>
                      <img
                        src={story.coverImage?.url}
                        alt={story.title}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" noWrap sx={{ maxWidth: 200 }}>
                        {story.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {story.author?.firstName} {story.author?.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {story.categories?.slice(0, 2).map((category) => (
                          <Chip
                            key={category._id}
                            label={category.name}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {story.categories?.length > 2 && (
                          <Chip
                            label={`+${story.categories.length - 2}`}
                            size="small"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={story.status}
                        onChange={(e) => handleStatusChange(story._id, e.target.value)}
                        sx={{ minWidth: 100 }}
                      >
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="published">Published</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                      </TextField>
                    </TableCell>
                    <TableCell>{story.views}</TableCell>
                    <TableCell>{story.likesCount}</TableCell>
                    <TableCell>
                      {story.publishedAt ? 
                        new Date(story.publishedAt).toLocaleDateString() : 
                        'Not published'
                      }
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small">
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
                    <TableCell colSpan={9} align="center">
                      <Typography color="textSecondary">
                        No stories found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
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

export default Stories;