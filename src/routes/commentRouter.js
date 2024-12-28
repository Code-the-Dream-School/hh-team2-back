const express = require('express');
const {createComment, deleteComment, updateComment, getComments} = require('../controllers/commentController');
const {verifyToken} = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/:postId', verifyToken, createComment);
router.delete('/:commentId', verifyToken, deleteComment);
router.put('/:commentId', verifyToken, updateComment);
router.get('/', getComments)

module.exports= router;