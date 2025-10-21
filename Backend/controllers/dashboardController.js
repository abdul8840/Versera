import Story from '../models/Story.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

// @desc    Get stats and data for the reader dashboard
// @route   GET /api/dashboard
// @access  Private
export const getReaderDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Run queries in parallel for speed
    const [
      commentsWritten,
      storyLikes,
      commentLikes,
      user,
      recentlyRead,
      recommendedStories
    ] = await Promise.all([
      Comment.countDocuments({ user: userId }),
      Story.countDocuments({ likes: userId }),
      Comment.countDocuments({ likes: userId }),
      User.findById(userId).select('following myList'), // Get following and my-list IDs
      Story.find({ _id: { $in: req.user.myList } }) // Use req.user from 'protect' middleware
           .limit(3)
           .populate('author', 'firstName lastName')
           .sort({ createdAt: -1 }),
      Story.find({ _id: { $nin: req.user.myList }, status: 'published' })
           .limit(3)
           .populate('author', 'firstName lastName')
           .populate('categories', 'name')
           .sort({ views: -1 })
    ]);

    const stats = {
      storiesRead: user.myList.length, // Uses "My List" count as "Stories Read"
      likesGiven: storyLikes + commentLikes,
      commentsWritten: commentsWritten,
      writersFollowed: user.following.length,
    };

    // Format recommendations to match your mock data
    const formattedRecommendations = recommendedStories.map(story => ({
      title: story.title,
      author: `${story.author.firstName} ${story.author.lastName}`,
      genre: story.categories[0]?.name || 'General'
    }));

    // Format recently read (progress is not trackable with current models)
    const formattedRecentlyRead = recentlyRead.map(story => ({
        title: story.title,
        author: `${story.author.firstName} ${story.author.lastName}`,
        progress: 100 // Assume 100% since it's in their list
    }));

    res.json({
      success: true,
      stats,
      recentlyRead: formattedRecentlyRead,
      recommendedStories: formattedRecommendations
    });

  } catch (error) {
    console.error('Get Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};