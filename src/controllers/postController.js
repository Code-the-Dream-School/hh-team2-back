// const { NotFoundError, BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const Post = require('../models/Post.js');
const Category = require('../models/Category');

// ================================
// Create POST

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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
  }
};

// =============================
//  find all posts created by a specific author

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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostsByAuthor,
};
