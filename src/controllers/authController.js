const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {User, validateRegisterUser, validateLoginUser} = require("../models/User");


//Register
/**-----------------------------------------------
 * @desc    Register New User or signup 
 * @route   /api/auth/register   endpoint
 * @method  POST
 * @access  public
 ------------------------------------------------*/

 module.exports.registerUserCtrl = asyncHandler(async (req,res) => {
    // 1- validation
    const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
    // 2- is user already exisit
    let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "user already exist" });
  }

  // 3- hash the password 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // 4- new user and save it to DB
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    //chose one (admin, mentor , student )
    // role: req.body.role,
  });
  await user.save();

    // 5- send a response to client 
    res.status(201).json({
        message: "you register is good , please login ",
      });
 })


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
      // 3- check the password 
      const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: "invalid  password "});
      }
      // 4- generate token (jwt)
      const token = user.generateAuthToken();

      ///#we should to Protect Routes Based on User Role

      // 5- response sent to the client 
      res.status(201).json({
        _id: user._id,
        isAdmin: user.isAdmin,
        // role: user.role,   // Send role to the frontend
        profilePhoto: user.profilePhoto,
        token,
      });


 });