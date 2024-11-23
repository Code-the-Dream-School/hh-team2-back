// const { NotFoundError, BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const Post = require('../models/Post.js');
const Category = require('../models/Category');

// ================================
// Create POST
//Admin
/**-----------------------------------------------
 * @desc   Create Post 
 * @route   /api/v1/posts   endpoint
 * @method  post
 
 ------------------------------------------------*/

const createPost = async (req, res) => {
  const { title, content, categoryId, authorId } = req.body;

  try {
    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Category not found' });
    }

    // Create the post
    const newPost = new Post({
      title,
      content,
      category: categoryId,
      author: authorId,
    });

    // Save the post to the database
    await newPost.save();
    res
      .status(StatusCodes.CREATED)
      .json({ message: 'The post has been successfully created.', newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message || 'Error creating post';
    res.status(statusCode).json({ error: errorMessage });
  }
};

// =========================
//find all posts

/**-----------------------------------------------
 * @desc   Get all posts
 * @route   /api/v1/posts   endpoint
 * @method  get
 ------------------------------------------------*/

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('category', 'name') // Populate category with its name
      //   .populate('author', 'username email') // Populate author with username and email
      .sort({ createdAt: -1 }); // Sort by newest posts first

    if (posts.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'No posts found' });
    }

    res.status(StatusCodes.OK).json({ posts, count: posts.length });
  } catch (error) {
    console.error('Error retrieving posts:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message || 'Error retrieving posts';
    res.status(statusCode).json({ error: errorMessage });
  }
};

// =============================
//  find all posts created by a specific author

/**-----------------------------------------------
 * @desc   Get all posts created by a specific author
 * @route   /api/v1/posts/author/:authorId  endpoint
 * @method  get
 ------------------------------------------------*/

const getPostsByAuthor = async (req, res) => {
  const { authorId } = req.params;

  try {
    // Find posts where the `author` field matches the provided author ID
    const posts = await Post.find({ author: authorId })
      .populate('category', 'name') // Optional: Populate category name
      //   .populate('author', 'username email') // Optional: Populate author details
      .sort({ createdAt: -1 }); // Sort by newest first

    if (posts.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'No posts found' });
    }

    res.status(StatusCodes.OK).json({ posts, count: posts.length });
  } catch (error) {
    console.error('Error retrieving posts:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message || 'Error retrieving posts';
    res.status(statusCode).json({ error: errorMessage });
  }
};

// ===========================================

// get posts by ID

/**-----------------------------------------------
 * @desc   Get a post by ID
 * @route   /api/v1/posts/:id  endpoint
 * @method  get
 ------------------------------------------------*/
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // .populate( /// commented as User Schema is not merged yet
    //   'author',
    //   'username'
    // );
    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'No post found' });
    }

    res.status(StatusCodes.OK).json(post);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message || 'Error retrieving posts';
    res.status(statusCode).json({ error: errorMessage });
  }
};

// ======================================
// delete post

/**-----------------------------------------------
 * @desc   Delete post by ID
 * @route   /api/v1/posts/:id  endpoint
 * @method  delete
 ------------------------------------------------*/

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);

    res.status(StatusCodes.OK).json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting Post:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message || 'Error deleting Post';
    res.status(statusCode).json({ error: errorMessage });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostsByAuthor,
  getPostById,
  deletePost,
};
