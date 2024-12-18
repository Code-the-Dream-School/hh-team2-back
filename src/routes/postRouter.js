const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/verifyToken');
//const validateObjectId = require('../middlewares/validateObjectId');
const photoUpload = require('../middlewares/photoUpload');

const {
  createPost,
  getAllPosts,
  getPostsByAuthor,
  getPostById,
  deletePost,
  updatePost,
} = require('../controllers/postController');

//add a new post
router
  .route('/')
  .post(verifyToken, photoUpload.single('image'), createPost)
  .get(getAllPosts);
// Get all posts by an author
router.route('/author/:authorId').get(getPostsByAuthor);
// Get Post / delete Post / update Post by ID
router
  .route('/:id')
  .get(getPostById)
  .delete(verifyToken, deletePost)
  .patch(verifyToken, photoUpload.single('image'), updatePost);

module.exports = router;
