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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  updateUser,
  clearError,
  clearSuccess,
} from '../store/slices/userSlice';

const WriterStoriesDialog = ({ open, onClose, writer }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && writer) {
      fetchWriterStories();
    }
  }, [open, writer]);

  const fetchWriterStories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/stories?author=${writer._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStories(data.stories);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Stories by {writer?.firstName} {writer?.lastName}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell>Likes</TableCell>
                  <TableCell>Published</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stories.map((story) => (
                  <TableRow key={story._id}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {story.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={story.status}
                        color={
                          story.status === 'published' ? 'success' : 
                          story.status === 'draft' ? 'default' : 'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{story.views}</TableCell>
                    <TableCell>{story.likesCount}</TableCell>
                    <TableCell>
                      {story.publishedAt ? 
                        new Date(story.publishedAt).toLocaleDateString() : 
                        'Not published'
                      }
                    </TableCell>
                  </TableRow>
                ))}
                {stories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="textSecondary">
                        No stories found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const Writers = () => {
  const dispatch = useDispatch();
  const { users, loading, error, success, pagination } = useSelector((state) => state.user);
  
  const [filters, setFilters] = useState({
    page: 1,
    search: '',
  });
  const [storiesDialogOpen, setStoriesDialogOpen] = useState(false);
  const [selectedWriter, setSelectedWriter] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers({ ...filters, role: 'writer' }));
  }, [dispatch, filters]);

  useEffect(() => {
    if (success) {
      dispatch(fetchUsers({ ...filters, role: 'writer' }));
    }
  }, [success, dispatch, filters]);

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

  const handleStatusToggle = (writer) => {
    dispatch(updateUser({
      id: writer._id,
      userData: { isActive: !writer.isActive }
    }));
  };

  const handleViewStories = (writer) => {
    setSelectedWriter(writer);
    setStoriesDialogOpen(true);
  };

  const handleCloseSnackbar = () => {
    dispatch(clearError());
    dispatch(clearSuccess());
  };

  const writers = users.filter(user => user.role === 'writer');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Writers Management
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
            label="Search Writers"
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{ minWidth: 200 }}
          />
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
                  <TableCell>Stories</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {writers.map((writer) => (
                  <TableRow key={writer._id}>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {writer.firstName} {writer.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>{writer.email}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleViewStories(writer)}
                      >
                        View Stories
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={writer.isActive ? 'Active' : 'Blocked'}
                        color={writer.isActive ? 'success' : 'error'}
                        onClick={() => handleStatusToggle(writer)}
                        clickable
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(writer.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        startIcon={<ViewIcon />}
                        size="small"
                        onClick={() => handleViewStories(writer)}
                      >
                        Stories
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {writers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="textSecondary">
                        No writers found
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

      <WriterStoriesDialog
        open={storiesDialogOpen}
        onClose={() => setStoriesDialogOpen(false)}
        writer={selectedWriter}
      />
    </Box>
  );
};

export default Writers;