// const { NotFoundError, BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const Post = require('../models/Post.js');

const path = require('path');
const fs = require('fs');

const { cloudinaryUploadImage } = require('../utils/cloudinary');

// ================================
// Create POST
//Admin
/**-----------------------------------------------
 * @desc   Create Post 
 * @route   /api/v1/posts   endpoint
 * @method  post
 
 ------------------------------------------------*/

const createPost = async (req, res) => {
  const { title, content } = req.body;

  try {
    let imageUrl = null;

    if (req.file) {
      const imagePath = path.join(
        __dirname,
        `../../images/${req.file.filename}`
      );

      // Upload the image to cloudinary
      const result = await cloudinaryUploadImage(imagePath);
      imageUrl = result.secure_url; // Get the secure URL for the uploaded image

      // Remove image from the server
      fs.unlinkSync(imagePath);
    }

    // Create the post

    const newPost = new Post({
      title,
      content,
      author: req.user.id, // assuming the user is authenticated
      image: imageUrl,
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
  const { search, page = 1, limit = 10 } = req.query;
  const query = search ? { title: new RegExp(search, 'i') } : {};
  try {
    const posts = await Post.find(query)
      // .populate('category', 'name') // Populate category with its name
      .populate('author', 'first_name last_name email') // Populate author with username and email
      .sort({ createdAt: -1 }) // Sort by newest posts first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(query);

    if (posts.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'No posts found' });
    }

    res.status(StatusCodes.OK).json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: posts.length,
    });
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
  const { search, page = 1, limit = 10 } = req.query;
  const query = search ? { title: new RegExp(search, 'i') } : {};
  const { authorId } = req.params;

  try {
    // Find posts where the `author` field matches the provided author ID
    const posts = await Post.find({ author: authorId })
      // .populate('category', 'name') // Optional: Populate category name
      .populate('author', 'first_name last_name email') // Optional: Populate author details
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(query);

    if (posts.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'No posts found' });
    }

    res.status(StatusCodes.OK).json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: posts.length,
    });
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
    const post = await Post.findById(req.params.id).populate(
      'author',
      'first_name last_name email'
    );
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
    const { id } = req.params; // Extract post ID from the route parameters
    // await Post.findByIdAndDelete(req.params.id);

    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Post not found' });
    }

    // Only admin and the author of the post can delete post
    if (req.user.role === 'admin') {
      await Post.findByIdAndDelete(req.params.id);
    } else {
      // Verify if the authenticated user is the post's author
      if (post.author.toString() !== req.user.id) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'Unauthorized to delete this post' });
      }

      await Post.findByIdAndDelete(req.params.id);
    }

    res.status(StatusCodes.OK).json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting Post:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message || 'Error deleting Post';
    res.status(statusCode).json({ error: errorMessage });
  }
};

// =====================================================

// Update a post by ID

/**-----------------------------------------------
 * @desc   Update post by ID
 * @route   /api/v1/posts/:id  endpoint
 * @method  patch
 ------------------------------------------------*/
const updatePost = async (req, res) => {
  const { id } = req.params; // Extract post ID from the route parameters
  const { title, content } = req.body; // Get the updated data from the request body

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Post not found' });
    }

    // Verify if the authenticated user is the post's author
    if (post.author.toString() !== req.user.id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Unauthorized to update this post' });
    }

    let imageUrl = post.image;

    // If a new image is uploaded, upload to Cloudinary
    if (req.file) {
      const result = await cloudinaryUploadImage(req.file.path);
      imageUrl = result.secure_url; // Update the image URL

      // Clean up the temporary file
      // Remove image from the server
      fs.unlinkSync(req.file.path);
    }

    // Update the post fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.image = imageUrl;

    const updatedPost = await post.save();
    res.status(StatusCodes.OK).json(updatedPost);
  } catch (error) {
    console.error('Error updating Post:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message || 'Error updating Post';
    res.status(statusCode).json({ error: errorMessage });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostsByAuthor,
  getPostById,
  deletePost,
  updatePost,
};
