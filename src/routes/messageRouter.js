const express = require('express');
const router = express.Router();

const {
    sendMessage,
    searchUsers,
    getMessages,
    reactToMessage,
    markAsRead,
    deleteMessage,
    deleteAllMessagesFromSender
} = require('../controllers/messageController');
const {verifyToken} = require('../middlewares/verifyToken');

//send a message
router.post('/', verifyToken, sendMessage);

//search user
router.post('/search', verifyToken, searchUsers);

//get messages from one sender
router.get('/:userId', verifyToken,  getMessages);

//react with emoji to message
router.post('/:messageId/react', verifyToken, reactToMessage);

//mark a message as read
router.patch('/:messageId/read', verifyToken, markAsRead);

//delete message
router.delete('/:messageId', verifyToken, deleteMessage);

//delet all messages from a unique sender
router.delete('/sender/:otherUserId', verifyToken, deleteAllMessagesFromSender);



module.exports = router;