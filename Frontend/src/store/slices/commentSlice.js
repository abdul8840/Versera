import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchStoryComments = createAsyncThunk(
  'comment/fetchStoryComments',
  async ({ storyId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/comments/stories/${storyId}/comments?page=${page}`);

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch comments');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createComment = createAsyncThunk(
  'comment/createComment',
  async ({ storyId, content, parentComment }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/comments/stories/${storyId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content, parentComment }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create comment');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comment/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update comment');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
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
        return rejectWithValue(data.message || 'Failed to delete comment');
      }

      return { commentId, message: data.message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  'comment/toggleCommentLike',
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
        return rejectWithValue(data.message || 'Failed to toggle comment like');
      }

      return { commentId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    comments: [],
    loading: false,
    error: null,
    success: false,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalComments: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    addComment: (state, action) => {
      state.comments.unshift(action.payload);
    },
    updateCommentLocal: (state, action) => {
      const index = state.comments.findIndex(comment => comment._id === action.payload._id);
      if (index !== -1) {
        state.comments[index] = action.payload;
      }
    },
    removeComment: (state, action) => {
      state.comments = state.comments.filter(comment => comment._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchStoryComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoryComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.comments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStoryComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
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
            if (!state.comments[parentIndex].replies) {
              state.comments[parentIndex].replies = [];
            }
            state.comments[parentIndex].replies.push(action.payload.comment);
          }
        } else {
          state.comments.unshift(action.payload.comment);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(comment => comment._id === action.payload.comment._id);
        if (index !== -1) {
          state.comments[index] = action.payload.comment;
        }
        // Also check in replies
        state.comments.forEach(comment => {
          if (comment.replies) {
            const replyIndex = comment.replies.findIndex(reply => reply._id === action.payload.comment._id);
            if (replyIndex !== -1) {
              comment.replies[replyIndex] = action.payload.comment;
            }
          }
        });
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(comment => comment._id !== action.payload.commentId);
        // Also remove from replies
        state.comments.forEach(comment => {
          if (comment.replies) {
            comment.replies = comment.replies.filter(reply => reply._id !== action.payload.commentId);
          }
        });
      })
      // Toggle Comment Like
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { commentId, liked } = action.payload;
        // Update in main comments
        const comment = state.comments.find(c => c._id === commentId);
        if (comment) {
          comment.isLiked = liked;
          comment.likesCount = liked ? comment.likesCount + 1 : comment.likesCount - 1;
        }
        // Update in replies
        state.comments.forEach(parentComment => {
          if (parentComment.replies) {
            const reply = parentComment.replies.find(r => r._id === commentId);
            if (reply) {
              reply.isLiked = liked;
              reply.likesCount = liked ? reply.likesCount + 1 : reply.likesCount - 1;
            }
          }
        });
      });
  },
});

export const { clearError, clearSuccess, addComment, updateCommentLocal, removeComment } = commentSlice.actions;
export default commentSlice.reducer;