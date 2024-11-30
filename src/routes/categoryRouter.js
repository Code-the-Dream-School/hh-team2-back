const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/verifyToken');
const { createCategory } = require('../controllers/categoryController');

//add a new post
router.route('/').post(verifyToken, createCategory);
module.exports = router;
