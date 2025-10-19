import { validationResult } from 'express-validator';
import Comment from '../models/Comment.js';
import Story from '../models/Story.js';

// @desc    Create comment
// @route   POST /api/stories/:storyId/comments
// @access  Private
export const createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { content, parentComment } = req.body;
    const { storyId } = req.params;

    // Check if story exists and is published
    const story = await Story.findOne({ _id: storyId, status: 'published', isActive: true });
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    const commentData = {
      content,
      user: req.user.id,
      story: storyId
    };

    // Handle reply to comment
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
      commentData.parentComment = parentComment;
    }

    const comment = await Comment.create(commentData);

    // If it's a reply, add to parent's replies
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, {
        $push: { replies: comment._id }
      });
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'firstName lastName profilePicture')
      .populate('replies');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: populatedComment
    });

  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating comment'
    });
  }
};

// @desc    Get comments for a story
// @route   GET /api/stories/:storyId/comments
// @access  Public
export const getStoryComments = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      story: storyId,
      parentComment: null, // Only top-level comments
      isActive: true
    })
      .populate('user', 'firstName lastName profilePicture')
      .populate({
        path: 'replies',
        populate: {
          path: 'user',
          select: 'firstName lastName profilePicture'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalComments = await Comment.countDocuments({
      story: storyId,
      parentComment: null,
      isActive: true
    });

    res.json({
      success: true,
      count: comments.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalComments / limit),
        totalComments,
        hasNext: page < Math.ceil(totalComments / limit),
        hasPrev: page > 1
      },
      comments
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching comments'
    });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { content } = req.body;

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the comment author
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment.content = content;
    comment.isEdited = true;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('user', 'firstName lastName profilePicture')
      .populate('replies');

    res.json({
      success: true,
      message: 'Comment updated successfully',
      comment: updatedComment
    });

  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating comment'
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the comment author or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    // Soft delete by setting isActive to false
    comment.isActive = false;
    await comment.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting comment'
    });
  }
};

// @desc    Like/Unlike comment
// @route   POST /api/comments/:id/like
// @access  Private
export const toggleCommentLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const userId = req.user.id;
    const likeIndex = comment.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
      await comment.save();
      res.json({
        success: true,
        message: 'Comment unliked',
        liked: false
      });
    } else {
      // Like
      comment.likes.push(userId);
      await comment.save();
      res.json({
        success: true,
        message: 'Comment liked',
        liked: true
      });
    }

  } catch (error) {
    console.error('Toggle comment like error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling comment like'
    });
  }
};