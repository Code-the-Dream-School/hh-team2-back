const express = require('express');
const router = express.Router();
const {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    getAllGroups
} = require('../controllers/groupController');

const {verifyToken} = require('../middlewares/verifyToken');
const validateObjectId = require('../middlewares/validateObjectId');

router.use(verifyToken);

//POST /api/v1/groups - creation of new group only for admin
router.post('/', createGroup);

//GET /api/v1/groups/:groupId - info about particular group
router.get('/:groupId', getGroup);

//PATCH /api/v1/groups/:groupId - updete group's info
router.patch('/:groupId', updateGroup);

//DELETE /api/v1/groups/:groupId - delete group
router.delete('/:groupId', deleteGroup);

//GET /api/v1/groups - get all groups based on the role
router.get('/', getAllGroups);

module.exports = router;

