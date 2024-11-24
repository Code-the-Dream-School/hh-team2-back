const express = require('express');
const router = express.Router();
const { createCategory } = require('../controllers/categoryController');

//add a new post
router.route('/').post(createCategory);
module.exports = router;
