const express = require('express');
const router = express.Router();

// const auth = require('../middlewares/authentication');
const {
  createPost,
  getAllPosts,
  getPostsByAuthor,
  getPostById,
  deletePost,
} = require('../controllers/postController');

//add a new post
router.route('/').post(createPost).get(getAllPosts);
// Get all posts by an author
router.route('/author/:authorId').get(getPostsByAuthor);
// Get Post by ID
router.route('/:id').get(getPostById).delete(deletePost);

module.exports = router;
