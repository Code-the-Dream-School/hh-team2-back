const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const {
  createPost,
  getAllPosts,
  getPostsByAuthor,
} = require('../controllers/postController');

//add a new post
router.route('/').post(createPost).get(getAllPosts);
// Get all posts by an author
router.route('/author/:authorId').get(getPostsByAuthor);

module.exports = router;
