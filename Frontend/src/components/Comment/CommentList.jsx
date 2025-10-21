import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoryComments, createComment } from '../../store/slices/commentSlice';
import Comment from './Comment';

const CommentList = ({ storyId }) => {
  const dispatch = useDispatch();
  const { comments, pagination, loading } = useSelector((state) => state.comment);
  const { user } = useSelector((state) => state.auth); // Assuming 'auth' slice
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch first page of comments on mount
    dispatch(fetchStoryComments({ storyId, page: 1 }));
  }, [dispatch, storyId]);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    dispatch(createComment({ storyId, content: newComment, parentComment: null }));
    setNewComment('');
  };

  const loadMoreComments = () => {
    dispatch(fetchStoryComments({ storyId, page: pagination.currentPage + 1 }));
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm mt-8">
      <h3 className="text-2xl font-bold mb-4">Comments ({pagination.totalComments || 0})</h3>
      
      {user ? (
        <form onSubmit={handlePostComment} className="mb-6">
          <textarea
            className="w-full p-3 border rounded"
            rows="3"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2 font-semibold hover:bg-blue-700">
            Post Comment
          </button>
        </form>
      ) : (
        <p className="mb-6 p-4 bg-gray-100 rounded text-center">
          Please <Link to="/login" className="font-bold text-blue-600">log in</Link> to post a comment.
        </p>
      )}

      <div className="space-y-4">
        {comments.map(comment => (
          <Comment key={comment._id} comment={comment} storyId={storyId} />
        ))}
      </div>

      {loading && <p className="text-center mt-4">Loading comments...</p>}
      
      {pagination.hasNext && !loading && (
        <button 
          onClick={loadMoreComments} 
          className="w-full mt-6 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
        >
          Load More Comments
        </button>
      )}
    </div>
  );
};

export default CommentList;