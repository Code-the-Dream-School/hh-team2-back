const { StatusCodes } = require('http-status-codes');

const Reaction = require('../models/Reaction');
const Post = require('../models/Post');

const mongoose = require('mongoose');

// --------------------------------

//  Add or Update a Reaction
// This controller adds a new reaction or updates an existing one.

/**-----------------------------------------------
 * @desc   Add or Update a Reaction
 * @route   /api/v1/reactions/postID   endpoint
 * @method  post
 ------------------------------------------------*/

const addOrUpdateReaction = async (req, res) => {
  const { postId } = req.params; // ID of the post
  const { reactionType } = req.body; // Reaction type (like/dislike)
  const userId = req.user.id; // Logged-in user's ID

  console.log(reactionType);

  try {
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Post not found' });

    // Add or update the reaction
    const reaction = await Reaction.findOneAndUpdate(
      { post: postId, user: userId },
      { reactionType },
      { upsert: true, new: true } // Create if not found, return the updated document
    );

    res
      .status(StatusCodes.OK)
      .json({ message: 'Reaction added/updated successfully', reaction });
  } catch (error) {
    console.error('Error adding or updating reaction:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message || 'Error adding or updating reaction';
    res.status(statusCode).json({ error: errorMessage });
  }
};

// ===============================================

//delete a reaction

/**-----------------------------------------------
 * @desc   Delete a reaction
 * @route   /api/v1/reactions/postID   endpoint 
 * @method  delete
 ------------------------------------------------*/

const deleteReaction = async (req, res) => {
  const { postId } = req.params; // ID of the post
  const userId = req.user.id; // Logged-in user's ID

  try {
    const reaction = await Reaction.findOneAndDelete({
      post: postId,
      user: userId,
    });

    if (!reaction)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Reaction not found' });

    res
      .status(StatusCodes.OK)
      .json({ message: 'Reaction removed successfully' });
  } catch (error) {
    console.error('Error removing reaction:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message || 'Error removing reaction';
    res.status(statusCode).json({ error: errorMessage });
  }
};

// =============================================================
// This controller retrieves all reactions for a specific post.

/**-----------------------------------------------
 * @desc   retrieves all reactions for a specific post
 * @route   /api/v1/reactions/postID   endpoint 
 * @method  get
 ------------------------------------------------*/

const getReactionsForPost = async (req, res) => {
  const { postId } = req.params; // ID of the post

  try {
    const reactions = await Reaction.find({ post: postId }).populate(
      'user',
      'first_name last_name email'
    );

    const groupedReactions = reactions.reduce((acc, reaction) => {
      acc[reaction.reactionType] = acc[reaction.reactionType] || [];
      acc[reaction.reactionType].push(reaction.user);

      return acc;
    }, {});

    res.status(StatusCodes.OK).json({ reactions: groupedReactions });
  } catch (error) {
    console.error('Error retrieving reactions for a post', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage =
      error.message || 'Error retrieving reactions for a post';
    res.status(statusCode).json({ error: errorMessage });
  }
};

// ------------------------------------------------

// get reaction counts for a post
// This controller fetches the counts of each reaction type for a post.

/**-----------------------------------------------
 * @desc   fetches the counts of each reaction type for a post
 * @route   /api/v1/reactions/postID/counts   endpoint 
 * @method  get
 ------------------------------------------------*/

const getReactionCountsForPost = async (req, res) => {
  const { postId } = req.params; // ID of the post

  try {
    const counts = await Reaction.aggregate([
      { $match: { post: new mongoose.Types.ObjectId(postId) } },
      { $group: { _id: '$reactionType', count: { $sum: 1 } } },
    ]);

    const formattedCounts = counts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(StatusCodes.OK).json({ counts: formattedCounts });
  } catch (error) {
    console.error('Error retrieving reactions counts', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message || 'Error retrieving reactions counts';
    res.status(statusCode).json({ error: errorMessage });
  }
};

module.exports = {
  addOrUpdateReaction,
  deleteReaction,
  getReactionsForPost,
  getReactionCountsForPost,
};
