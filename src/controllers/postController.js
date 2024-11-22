// const { NotFoundError, BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const Post = require('../models/Post.js');
const Category = require('../models/Category');

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

module.exports = {
  createPost,
};
