const Comment = require('../models/Comment');
const Post = require('../models/Post');
const{BadRequestError, NotFoundError, UnauthenticatedError}=require('../errors');

//create a new comment

const createComment = async (req, res, next) =>{
    try{
        const {content, post: postId} = req.body;

        if(!content || !postId){
            throw new BadRequestError('Contemt and post are required');
        }
        const post = await Post.findById(postId);
        if(!post){
            throw new NotFoundError('Post not found');
        }

        const newComment = await Comment.create({
            content,
            user: req.user.id,
            post: post.id
        });

        const populateComment = await Comment.findById(newComment._id)
        .populate('user')
        .populate('post');

        res.status(201).json({success:true, comment:populateComment});

    } catch(error){
        next(error);
    }
};

//delete comment

const deleteComment = async (req, res, next) =>{
    try {
        const {commentId} = req.params;

        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new NotFoundError('Comment is not found');
        }
        if(comment.user.toString() !== req.user.id){
            throw new UnauthenticatedError('You not authorized to delite this comment');
        }
        await comment.deleteOne();
        res.status(200).json({success: true, message: 'Comment was successfuly deleted'});
    } catch(error){
        next(error);
    }
};

//update a comment

const updateComment = async (req, res, next) =>{
    try{
        const {commentId} = req.params;
        const {content} = req.body;

        if(!content){
            throw new BadRequestError('Comment required text for update');
        }
        const comment = await Comment.findById(commentId).populate('user');
        if(!comment.user){
            throw new NotFoundError('Comment was not found');
        }
        if(comment.user._id.toString() !== req.user.id){
            throw new UnauthenticatedError('You not authorized to edit this comment');
        }
        comment.content = content;
        await comment.save();
        res.status(201).json({success: true, comment});
    }catch(error){
        next(error);
    }
};

//get all comments

const getComments = async (req, res, next) =>{
    try{
        const {post,user} = req.query;
        const filter = {};
        if(post) filter.post = post;
        if (user) filter.user = user;

        const comments = await Comment.find(filter)
        .populate('user', 'first_name last_name email')
        .populate('post', 'title content')
        .sort({createdAt: -1});

        if(!comments.length){
            throw new NotFoundError('Comments not found');
        }

        res.status(200).json({success: true, comments});
    } catch(error){
        next(error);
    }
};

module.exports = {createComment, deleteComment, updateComment, getComments};