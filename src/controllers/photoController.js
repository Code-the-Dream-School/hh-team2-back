const asyncHandler = require("express-async-handler");
//  Upload Profile Photo
/**-----------------------------------------------
 * @desc   Profile Photo Upload 
 * @route   /api/users/photo-upload  endpoint
 * @method  POST
 * @access  private (only Logged in user)
 ------------------------------------------------*/

 module.exports.PhotoUploadCtrl = asyncHandler(async (req, res ) => {
    if(!req.file)  {
        return res.status(400).json({ message: 'no file provided'})
    }
    // console.log(req.file); // to get the file from the client 
    res.status(200).json({ message: 'your profile photo uploaded successfully'});
 });