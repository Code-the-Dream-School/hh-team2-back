const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {User, validateRegisterUser, validateLoginUser} = require("../models/User");
const Group = require('../models/Group');


//Register
/**-----------------------------------------------
 * @desc    Register New User or signup 
 * @route   /api/auth/register   endpoint
 * @method  POST
 * @access  public
 ------------------------------------------------*/

 module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  // 1- Validation
  const { error } = validateRegisterUser(req.body);
  if (error) {
      return res.status(400).json({ message: error.details[0].message });
  }

  // 2- Check if user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) {
      return res.status(400).json({ message: "User already exists" });
  }

  // 3- If the user is not an admin, assign them to a group
  let group = null;
  if (req.body.role !== 'admin') {
      // Check if the group exists by its name
      group = await Group.findOne({ name: req.body.groupName });

      if (!group) {
          // If the group doesn't exist, create it
          group = new Group({
              name: req.body.groupName,
          });
          try {
              // Save the new group
              await group.save();
          } catch (err) {
              return res.status(500).json({ message: "Failed to create group: " + err.message });
          }
      }
  }

  // 4- Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // 5- Create and save the new user
  user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || 'student',  // Default role is student
      isAdmin: req.body.role === 'admin',  // If role is 'admin', set isAdmin to true
      groupId: group ? group._id : null,  // Only assign a group if the user is not an admin
  });

  try {
      await user.save();  // Save the new user
  } catch (err) {
      return res.status(500).json({ message: "Failed to create user: " + err.message });
  }

  // 6- Send a response to the client
  res.status(201).json({
      message: "Registration successful. Please log in.",
  });
});



// Login 
 /**-----------------------------------------------
 * @desc    Login User  
 * @route   /api/auth/login   endpoint
 * @method  POST
 * @access  public
 ------------------------------------------------*/

 module.exports.loginUserCtrl = asyncHandler (async (req, res ) =>{
      // 1- validation
      const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } 

      //2- is the user exist in the DB 
      const user = await User.findOne({ email: req.body.email});
      if (!user) {
        return res.status(400).json({ message: "invalid email or password "});
      }
      // 3- check if the password matches
      const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: "invalid  password "});
      }

    //    // 4- Check if the user belongs to a group (only for non-admin users)
    // let userGroup = null;
    // if (user.role !== 'admin') {
    //     userGroup = await Group.findById(user.groupId);
    //     if (!userGroup) {
    //         return res.status(400).json({ message: "User is not assigned to any group" });
    //     }
    // }
      // 5- generate token (jwt)
      const token = user.generateAuthToken();

      ///#we should to Protect Routes Based on User Role

      // 5- response sent to the client 
      res.status(200).json({
        _id: user._id,
        isAdmin: user.isAdmin,
        role: user.role,          // Send role to the frontend
        groupId: user.groupId,    // Send groupId to the frontend
        profilePhoto: user.profilePhoto,
        token, 
        first_name: user.first_name,                   // Send the JWT token
    });


 });