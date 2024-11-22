const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const { createPost } = require('../controllers/postController');

//add a new post
router.route('/').post(createPost);

module.exports = router;
