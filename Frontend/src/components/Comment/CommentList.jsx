import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoryComments, createComment } from '../../store/slices/commentSlice'; // Adjust path
import Comment from './Comment';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CommentList = ({ storyId }) => {
  const dispatch = useDispatch();
  const { comments, pagination, loading, error } = useSelector((state) => state.comment);
  const { user } = useSelector((state) => state.auth); 
  const [newComment, setNewComment] = useState(''); 

  useEffect(() => {
    if (storyId) {
      dispatch(fetchStoryComments({ storyId, page: 1 }));
    }
  }, [dispatch, storyId]);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    dispatch(createComment({ storyId, content: newComment, parentComment: null }))
      .unwrap()
      .then(() => {
        setNewComment('');
        toast.success("Comment posted!");
      })
      .catch((err) => {
        toast.error(`Failed to post comment: ${err}`);
      });
  };

  const loadMoreComments = () => {
    if (!pagination.hasNext) return; 
    dispatch(fetchStoryComments({ storyId, page: pagination.currentPage + 1 }));
  };

  return (
    <div className="!bg-white !p-6 md:!p-8 !rounded-lg !shadow-md !mt-8">
      {/* Comment Section Header */}
      <h3 className="!text-2xl !font-bold !mb-6 !text-gray-800 border-b !pb-4">
        Comments ({pagination.totalComments || 0})
      </h3>

      {user ? (
        <form onSubmit={handlePostComment} className="!mb-8">
          <div className="!flex !items-start !space-x-3">
            <img
              src={user.profilePicture || '/default-avatar.png'}
              alt="Your avatar"
              className="!w-10 !h-10 !rounded-full !object-cover"
              onError={(e) => { e.target.src = '/default-avatar.png'; }}
            />
            <div className="!flex-1">
              <textarea
                className="!w-full !p-3 !border !border-gray-300 !rounded-md focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent !text-sm"
                rows="3"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <button
                type="submit"
                className="!bg-blue-600 hover:!bg-blue-700 !text-white !px-5 !py-2 !rounded-md !mt-2 !font-semibold !transition !cursor-pointer !text-sm"
              >
                Post Comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="!mb-8 !p-4 !bg-gray-100 !border !border-gray-200 !rounded-lg !text-center">
          <p className="!text-gray-700">
            Please <Link to="/login" className="!font-semibold !text-blue-600 hover:!underline">log in</Link> to join the conversation.
          </p>
        </div>
      )}

      {error && !loading && ( 
        <p className="!text-center !text-red-500 !bg-red-50 !p-3 !rounded-md">Error loading comments: {error}</p>
      )}

      <div className="!space-y-4">
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            comment ? <Comment key={comment._id} comment={comment} storyId={storyId} /> : null
          ))
        ) : (
          !loading && !error && <p className="!text-center !text-gray-500 !py-6">Be the first to comment!</p>
        )}
      </div>

      {loading && (
          <div className="!flex !justify-center !pt-6">
              L...
          </div>
      )}

      {/* Load More Button */}
      {pagination?.hasNext && !loading && (
        <button
          onClick={loadMoreComments}
          className="!w-full !mt-8 !bg-gray-100 hover:!bg-gray-200 !text-gray-700 !font-medium !py-2.5 !rounded-md !transition"
        >
          Load More Comments
        </button>
      )}
    </div>
  );
};

export default CommentList;