const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");


//Admin
/**-----------------------------------------------
 * @desc   Get all Users Profile 
 * @route   /api/auth/profile   endpoint
 * @method  get
 * @access  private (only admin)
 ------------------------------------------------*/
 module.exports.getAllUsersCtrl = asyncHandler(async (req,res) => {
   // console.log(req.headers.authorization.split(" ")[1]);
    const users = await User.find().select("-password");
    res.status(200).json(users);
 });


 //Admin can also get how many user are there 
/**-----------------------------------------------
 * @desc   Get Users Count 
 * @route   /api/users /count    endpoint
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
 module.exports.getUsersCountCtrl = asyncHandler(async (req,res) => {
   const count = await User.count();
   res.status(200).json(count);
});


 //get single user
/**-----------------------------------------------
 * @desc   Get  User Profile 
 * @route   /api/users/profile/:id   endpoint
 * @method  GET
 * @access  public 
 ------------------------------------------------*/
 module.exports.getUserProfileCtrl = asyncHandler(async (req,res) => {
   const user = await User.findById(req.params.id).select("-password");
   if (!user) {
    return res.status(400).json({message: "user not found"});
   }
   res.status(200).json(user);
   
});



//user can update their profile 
/**-----------------------------------------------
 * @desc   Update User Profile 
 * @route   /api/auth/profile/:id  endpoint
 * @method  PUT
 * @access  private (only user himself can update their profile (pic)))
 ------------------------------------------------*/
// 1- Validation
 module.exports.updateUserProfileCtrl = asyncHandler(async (req,res) => {
  const { error } = validateUpdateUser(req.body);
  if(error) {
    return res.status(400).json({ message: error.details[0].message});
  }
  // this for the password check if the user want to update the password 
  if(req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, {
    // set will get the user by id and update it 
    $set: {
      first_name:req.body.first_name,
      last_name: req.body.last_name,
      bio: req.body.bio

    }
  }, {new: true}).select("-password");// meaning gave me the new update if its true 

  res.status(200).json(updatedUser);


 });

