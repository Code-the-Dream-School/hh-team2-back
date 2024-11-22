const Category = require('../models/Category');
const { StatusCodes } = require('http-status-codes');

// Create a new category
const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: 'Category already exists' });
    }

    // Create and save the category
    const newCategory = new Category({ name });
    await newCategory.save();

    res
      .status(StatusCodes.CREATED)
      .json({
        message: 'The category has been successfully created.',
        newCategory,
      });
  } catch (error) {
    console.error('Error creating category:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message || 'Error creating category';
    res.status(statusCode).json({ error: errorMessage });
  }
};

module.exports = {
  createCategory,
};
