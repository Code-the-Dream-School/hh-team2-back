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

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter posts by title
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: A list of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 total:
 *                   type: integer
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/posts/author/{authorId}:
 *   get:
 *     summary: Get all posts by a specific author
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the author
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: A list of posts by the specified author
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 2
 *       404:
 *         description: Author not found or no posts available
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []  # Require JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Blog Post
 *               content:
 *                 type: string
 *                 example: This is the content of the blog post.
 *     responses:
 *       201:
 *         description: Post created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []  # Require JWT token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   patch:
 *     summary: Update an existing post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: [] # Require authentication with JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Blog Post Title
 *               content:
 *                 type: string
 *                 example: This is the updated content of the blog post.
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 64db4d394a9a7a00125f2c1b
 *                 title:
 *                   type: string
 *                   example: Updated Blog Post Title
 *                 content:
 *                   type: string
 *                   example: This is the updated content of the blog post.
 *                 category:
 *                   type: string
 *                   example: Technology
 *                 author:
 *                   type: string
 *                   example: 64db4d394a9a7a00125f2c1a
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-12-01T12:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-12-14T12:00:00.000Z
 *       400:
 *         description: Validation error or bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

//add a new post and get all posts
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
