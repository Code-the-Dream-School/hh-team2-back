const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/verifyToken');

const {
  addOrUpdateReaction,
  deleteReaction,
  getReactionsForPost,
  getReactionCountsForPost,
} = require('../controllers/reactionController');

// // Add or update a reaction
// router.post('/:postId', verifyToken, addOrUpdateReaction);

// // Remove a reaction
// router.delete('/:postId', verifyToken, deleteReaction);

// // Get all reactions for a post
// router.get('/:postId', getReactionsForPost);

// // Get reaction counts for a post
// router.get('/:postId/counts', getReactionCountsForPost);

router
  .route('/:postId')
  .post(verifyToken, addOrUpdateReaction)
  .delete(verifyToken, deleteReaction)
  .get(getReactionsForPost);

router.route('/:postId/counts').get(getReactionCountsForPost);

module.exports = router;
