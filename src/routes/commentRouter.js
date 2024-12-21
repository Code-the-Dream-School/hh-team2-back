const express = require('express');
const {createComment, deleteComment, updateComment} = require('../controllers/commentController');
const {verifyToken} = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/:postId', verifyToken, createComment);
router.delete('/:commentId', verifyToken, deleteComment);
router.put('/:commentId', verifyToken, updateComment);

module.exports= router;