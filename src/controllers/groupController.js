const Group = require('../models/Group');
//const User = require ('../models/User');
const asyncHandler = require('express-async-handler');

//create group
const createGroup = asyncHandler(async (req,res) => {
    const {name, mentorIds = [], studentIds=[]} = req.body;
    if(req.user.role !=='admin'){
        res.status(403);
        throw new Error ('Access denied');
    }

    const newGroup = new Group({name, mentorIds, studentIds});
    await newGroup.save();

    res.status(201).json({message:"Group successfully created", group: newGroup});
});

//get details
const getGroup = asyncHandler(async (req,res)=>{
    const {groupId} = req.params;
    const group =await Group.findById(groupId)
    .populate('mentorIds', 'name email')
    .populate('studentIds', 'name email');

    if(!group){
        res.status(404);
        throw new Error('No group found');
    }
    res.status(200).json(group);
});

//group update 

const updateGroup = asyncHandler(async (req,res)=>{
    const {groupId} = req.params;
    const {name, mentorIds, studentIds} = req.body;

    if (req.user.role !== 'admin' && req.user.role!=='mentor'){
        res.status(403);
        throw new Error('Access denied');
    }

    const group = await Group.findById(groupId);
    if(!group){
        res.status(404);
        throw new Error('No group found');
    }

    if(name) group.name= name;
    if(mentorIds) group.mentorIds = mentorIds;
    if(studentIds) group.studentIds = studentIds;

    await group.save();
    res.status(200).json({message: 'Group updated successfully', group});
});

//delete group

const deleteGroup = asyncHandler(async(req,res)=>{
    const{groupId} = req.params;
    if(req.user.role!=='admin'){
        res.status(403);
        throw new Error('Access denied');
    }
    const group = await Group.findByIdAndDelete(groupId);
    if(!group){
        res.status(404);
        throw new Error('No group found');
    }

    res.status(200).json({message: 'Group deleted successfully'});
})

//get all groups

const getAllGroups = asyncHandler(async(req,res)=>{
    const {role, _id} = req.user;
    let groups;
    //admin can see all groups
    if (role === 'admin'){
        groups = await Group.find()
        //.populate(mentorIds, 'name email')
        //.populate(studentIds, 'neme email');
    } else if(role === 'mentor'){
        groups = await Group.find({mentorIds: _id})
        //.populate('mentorIds', 'name email')
        //.populate('studentIds', 'name email');
    } else{
        res.status(403);
        throw new Error('Access denied');
    }
    res.status(200).json(groups);
});

module.exports = {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    getAllGroups
};