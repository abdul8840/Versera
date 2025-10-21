import User from '../models/User.js';
import Story from '../models/Story.js';
import mongoose from 'mongoose';

// @desc    Toggle a story in the user's "My List" (Add/Remove)
// @route   POST /api/my-list/:storyId
// @access  Private
export const toggleStoryInList = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ success: false, message: 'Invalid story ID' });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    const user = await User.findById(userId);
    
    // Check if the story is already in the list
    const storyIndex = user.myList.indexOf(storyId);

    let message;
    let added;

    if (storyIndex > -1) {
      // Story is in the list, so remove it
      user.myList.splice(storyIndex, 1);
      message = 'Story removed from your list';
      added = false;
    } else {
      // Story is not in the list, so add it
      user.myList.push(storyId);
      message = 'Story added to your list';
      added = true;
    }

    await user.save();
    
    res.json({
      success: true,
      message,
      added, // Send back whether it was added or removed
      myList: user.myList // Send back the updated list of IDs
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all stories in the user's "My List"
// @route   GET /api/my-list
// @access  Private
// export const getMyList = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate({
//       path: 'myList',
//       populate: [
//         { path: 'author', select: 'firstName lastName profilePicture' },
//         { path: 'categories', select: 'name' }
//       ]
//     });

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     res.json({
//       success: true,
//       stories: user.myList
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// In backend/controllers/myListController.js

export const getMyList = async (req, res) => {
  try {
    const userWithList = await User.findById(req.user.id).populate({
      path: 'myList',
      populate: [
        { path: 'author', select: 'firstName lastName profilePicture' },
        { path: 'categories', select: 'name' },
        // Keep populating likes to get the array
        { path: 'likes', select: '_id' } 
      ]
    });

    if (!userWithList) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // --- Process the stories to format the likes array ---
    const processedStories = userWithList.myList.map(story => {
      const storyObj = story.toObject(); // Convert Mongoose doc to plain object
      return {
        ...storyObj,
        likesCount: storyObj.likes?.length || 0, // Ensure likesCount is present
        // **Convert likes from [{_id: '...'}, ...] to ['...', '...']**
        likes: storyObj.likes?.map(like => like._id.toString()) || [], 
      };
    });
    // ----------------------------------------------------

    res.json({
      success: true,
      stories: processedStories // Send the processed list
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};