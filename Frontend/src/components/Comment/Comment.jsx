import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, updateComment, deleteComment, toggleCommentLike } from '../../store/slices/commentSlice';
import { formatDistanceToNow } from 'date-fns';
import { FaHeart, FaRegHeart, FaReply, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Comment = ({ comment, storyId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Local state for UI interactions
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);

  const canEditOrDelete = user && user._id === comment.user?._id; 

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return; 
    dispatch(createComment({ storyId, content: replyContent, parentComment: comment._id }))
      .unwrap()
      .then(() => {
        setReplyContent(''); 
        setIsReplying(false); 
        toast.success("Reply posted!");
      })
      .catch((err) => {
        toast.error(`Failed to post reply: ${err}`);
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    dispatch(updateComment({ commentId: comment._id, content: editContent }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        toast.success("Comment updated!");
      })
      .catch((err) => {
        toast.error(`Failed to update comment: ${err}`);
      });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment(comment._id))
        .unwrap()
        .then(() => {
          toast.success("Comment deleted.");
        })
        .catch((err) => {
          toast.error(`Failed to delete comment: ${err}`);
        });
    }
  };

  const handleLike = () => {
    if (!user) {
      toast.error("Please log in to like comments.");
      return;
    }
    dispatch(toggleCommentLike(comment._id));
  };
  const isLiked = user && comment.likes?.includes(user._id);
  const likesCount = comment.likes?.length || 0;

  if (!comment || !comment.user) {
    console.warn("Comment component received incomplete comment data:", comment);
    return null;
  }

  return (
    <div className="!flex !space-x-4 !py-4">
      {/* User Avatar */}
      <img
        src={comment.user.profilePicture || '/default-avatar.png'} // Use a default avatar
        alt={comment.user.firstName || 'User'}
        className="!w-10 !h-10 !rounded-full !object-cover !flex-shrink-0 !mt-1" // Added margin top
        onError={(e) => { e.target.src = '/default-avatar.png'; }} // Fallback on error
      />

      {/* Comment Content and Actions */}
      <div className="!flex-1">
        {/* Comment Header */}
        <div className="!flex !items-center !space-x-2 !mb-1"> {/* Reduced bottom margin */}
          <span className="!font-semibold !text-sm !text-gray-800">{`${comment.user.firstName || ''} ${comment.user.lastName || ''}`}</span>
          <span className="!text-xs !text-gray-500">
            • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
          {comment.isEdited && <span className="!text-xs !text-gray-400 !italic">(Edited)</span>}
        </div>

        {/* Comment Body (View or Edit) */}
        {!isEditing ? (
          <p className="!text-gray-700 !text-sm !leading-relaxed">{comment.content}</p>
        ) : (
          <form onSubmit={handleEditSubmit} className="!mt-2 !space-y-2">
            <textarea
              className="!w-full !p-2 !border !border-gray-300 !rounded-md focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent !text-sm"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows="3"
              required
            />
            <div className="!flex !space-x-2">
              <button
                type="submit"
                className="!text-xs !bg-green-600 hover:!bg-green-700 !text-white !font-medium !px-3 !py-1.5 !rounded-md !transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => { setIsEditing(false); setEditContent(comment.content); }} // Reset content on cancel
                className="!text-xs !bg-gray-200 hover:!bg-gray-300 !text-gray-700 !font-medium !px-3 !py-1.5 !rounded-md !transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Action Buttons (Like, Reply, Edit, Delete) */}
        {!isEditing && ( // Hide actions while editing
          <div className="!flex !items-center !space-x-4 !mt-2 !text-xs !text-gray-500">
            {/* Like Button */}
            <button onClick={handleLike} className="!flex !items-center !space-x-1 hover:!text-red-600 !transition group">
              {isLiked ? (
                <FaHeart className="!text-red-500 group-hover:!text-red-600" />
              ) : (
                <FaRegHeart className="group-hover:!text-red-500" />
              )}
              {/* Ensure likesCount updates based on commentSlice */}
              <span className={isLiked ? '!font-medium !text-red-600' : ''}>{likesCount}</span>
            </button>
            {/* Reply Button */}
            <button onClick={() => setIsReplying(!isReplying)} className="!flex !items-center !space-x-1 hover:!text-blue-600 !transition group">
              <FaReply className="group-hover:!text-blue-500"/>
              <span>Reply</span>
            </button>
            {/* Edit/Delete Buttons (Conditional) */}
            {canEditOrDelete && (
              <>
                <button onClick={() => setIsEditing(!isEditing)} className="!flex !items-center !space-x-1 hover:!text-green-600 !transition group">
                   <FaEdit className="group-hover:!text-green-500"/>
                   <span>Edit</span>
                </button>
                <button onClick={handleDelete} className="!flex !items-center !space-x-1 hover:!text-red-600 !transition group">
                    <FaTrash className="group-hover:!text-red-500"/>
                    <span>Delete</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Reply Form (Conditional) */}
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="!mt-3 !space-y-2">
            <textarea
              className="!w-full !p-2 !border !border-gray-300 !rounded-md focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent !text-sm"
              placeholder={`Replying to ${comment.user.firstName}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows="3"
              required
            />
            <div className="!flex !space-x-2">
              <button
                type="submit"
                className="!text-xs !bg-blue-600 hover:!bg-blue-700 !text-white !font-medium !px-3 !py-1.5 !rounded-md !transition !cursor-pointer"
              >
                Post Reply
              </button>
              {/* Cancel Button for Reply */}
              <button
                type="button"
                onClick={() => { setIsReplying(false); setReplyContent(''); }} // Close and clear form
                className="!text-xs !bg-gray-200 hover:!bg-gray-300 !text-gray-700 !font-medium !px-3 !py-1.5 !rounded-md !transition !cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Recursive Replies Section */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="!mt-4 !pl-6 !border-l-2 !border-gray-200 !space-y-4">
            {comment.replies.map(reply => (
              reply ? <Comment key={reply._id} comment={reply} storyId={storyId} /> : null
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;