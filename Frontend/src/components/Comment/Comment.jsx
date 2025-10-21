import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, updateComment, deleteComment, toggleCommentLike } from '../../store/slices/commentSlice';
import { Link } from 'react-router-dom';

// Helper for formatting dates (e.g., "2 hours ago")
import { formatDistanceToNow } from 'date-fns';

const Comment = ({ comment, storyId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Assuming your auth slice is named 'auth'
  
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);

  const canEditOrDelete = user && user._id === comment.user._id;

  const handleReplySubmit = (e) => {
    e.preventDefault();
    dispatch(createComment({ storyId, content: replyContent, parentComment: comment._id }));
    setReplyContent('');
    setIsReplying(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(updateComment({ commentId: comment._id, content: editContent }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment(comment._id));
    }
  };

  const handleLike = () => {
    if (!user) return; // Or redirect to login
    dispatch(toggleCommentLike(comment._id));
  };

  return (
    <div className="flex space-x-3 py-4 border-b border-gray-200">
      <img 
        src={comment.user.profilePicture || 'https://via.placeholder.com/40'} 
        alt={comment.user.firstName} 
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm">{`${comment.user.firstName} ${comment.user.lastName}`}</span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
          {comment.isEdited && <span className="text-xs text-gray-500">(Edited)</span>}
        </div>
        
        {!isEditing ? (
          <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
        ) : (
          <form onSubmit={handleEditSubmit} className="mt-2">
            <textarea
              className="w-full p-2 border rounded"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows="2"
            />
            <div className="flex space-x-2 mt-1">
              <button type="submit" className="text-xs bg-green-500 text-white px-2 py-1 rounded">Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="text-xs bg-gray-200 px-2 py-1 rounded">Cancel</button>
            </div>
          </form>
        )}

        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
          <button onClick={handleLike} className="flex items-center space-x-1 hover:text-red-500">
            {/* You'll need to adjust this based on what your API returns */}
            <i className={`fas fa-heart ${comment.isLiked ? 'text-red-500' : 'text-gray-400'}`}></i>
            <span>{comment.likes?.length || 0}</span>
          </button>
          <button onClick={() => setIsReplying(!isReplying)} className="hover:text-blue-500">Reply</button>
          {canEditOrDelete && (
            <>
              <button onClick={() => setIsEditing(!isEditing)} className="hover:text-green-500">Edit</button>
              <button onClick={handleDelete} className="hover:text-red-500">Delete</button>
            </>
          )}
        </div>

        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-3">
            <textarea
              className="w-full p-2 border rounded text-sm"
              placeholder={`Replying to ${comment.user.firstName}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows="2"
            />
            <button type="submit" className="text-xs bg-blue-500 text-white px-3 py-1 rounded mt-1">Post Reply</button>
          </form>
        )}

        {/* Recursive Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            {comment.replies.map(reply => (
              <Comment key={reply._id} comment={reply} storyId={storyId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;