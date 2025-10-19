import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getStoryComments = createAsyncThunk(
  'comments/getStoryComments',
  async ({ storyId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/comments/stories/${storyId}/comments?page=${page}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch comments');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ storyId, content, parentComment }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/comments/stories/${storyId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, parentComment }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create comment');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update comment');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete comment');
      }

      return { commentId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  'comments/toggleCommentLike',
  async (commentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle comment like');
      }

      return { commentId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    loading: false,
    error: null,
    success: false,
    pagination: {}
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    addTempComment: (state, action) => {
      state.comments.unshift(action.payload);
    },
    removeTempComment: (state, action) => {
      state.comments = state.comments.filter(comment => comment._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Story Comments
      .addCase(getStoryComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoryComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.comments;
        state.pagination = action.payload.pagination;
      })
      .addCase(getStoryComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload.comment.parentComment) {
          // Find parent comment and add reply
          const parentIndex = state.comments.findIndex(
            comment => comment._id === action.payload.comment.parentComment
          );
          if (parentIndex !== -1) {
            state.comments[parentIndex].replies.push(action.payload.comment);
          }
        } else {
          // Add as top-level comment
          state.comments.unshift(action.payload.comment);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload.comment;
        // Update in comments array
        const commentIndex = state.comments.findIndex(
          comment => comment._id === updatedComment._id
        );
        if (commentIndex !== -1) {
          state.comments[commentIndex] = updatedComment;
        } else {
          // Check in replies
          state.comments.forEach(comment => {
            const replyIndex = comment.replies.findIndex(
              reply => reply._id === updatedComment._id
            );
            if (replyIndex !== -1) {
              comment.replies[replyIndex] = updatedComment;
            }
          });
        }
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          comment => comment._id !== action.payload.commentId
        );
      })
      // Toggle Comment Like
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { commentId, liked } = action.payload;
        
        // Helper function to update likes in comment
        const updateCommentLikes = (comment) => {
          if (comment._id === commentId) {
            if (liked) {
              comment.likes.push('current-user');
            } else {
              comment.likes = comment.likes.filter(like => like !== 'current-user');
            }
          }
          return comment;
        };

        // Update in top-level comments
        state.comments = state.comments.map(updateCommentLikes);
        
        // Update in replies
        state.comments.forEach(comment => {
          comment.replies = comment.replies.map(updateCommentLikes);
        });
      });
  },
});

export const { clearError, clearSuccess, addTempComment, removeTempComment } = commentSlice.actions;
export default commentSlice.reducer;