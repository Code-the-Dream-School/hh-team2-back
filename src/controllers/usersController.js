const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");


//Admin
/**-----------------------------------------------
 * @desc   Get all Users Profile 
 * @route   /api/auth/profile   endpoint
 * @method  get
 * @access  private (only admin)
 ------------------------------------------------*/


 module.exports.getAllUsersCtrl = asyncHandler(async (req,res) => {
   // console.log(req.headers.authorization.split(" ")[1]);

  
    const users = await User.find();
    res.status(200).json(users);
 });