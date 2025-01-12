const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/verifyToken');
const { createCategory } = require('../controllers/categoryController');


const categories = [
    { id: 'intro_to_programming', name: 'Intro to Programming' },
    { id: 'react', name: 'React' },
    { id: 'node', name: 'Node' },
    { id: 'python', name: 'Python' },
    { id: 'ruby', name: 'Ruby' },
    { id: 'general', name: 'General' }
]

router.get('/', (req,res)=>{
    res.json(categories)
});
//add a new post
router.route('/').post(verifyToken, createCategory);
module.exports = router;
