
const asyncHandler = require("express-async-handler");
const path = require('path');
const fs = require('fs');
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require('../utils/cloudinary');
const { User, validateUpdateUser } = require("../models/User");

//  Upload Profile Photo
/**-----------------------------------------------
 * @desc   Profile Photo Upload 
 * @route   /api/users/photo-upload  endpoint
 * @method  POST
 * @access  private (only Logged in user)
 ------------------------------------------------*/

module.exports.PhotoUploadCtrl = asyncHandler(async (req, res) => {
    // 1- Validation 
    if (!req.file) {
        return res.status(400).json({ message: 'no file provided' });
    }
    console.log("File Path from req.file:", req.file.path);
console.log("File Name from req.file:", req.file.filename);


    // 2- Get the path to the image
    // const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const imagePath = path.join(__dirname, `../../images/${req.file.filename}`);
    console.log("Directory Name:", __dirname);
console.log("Resolved Image Path:", imagePath);

// 3- Check if the file exists at the resolved path
if (!fs.existsSync(imagePath)) {
    console.log("File does not exist at path:", imagePath);
    return res.status(400).json({ message: 'File not found on the server' });
}

    // 3-  Proceed with uploading the file to Cloudinary
    try {
        const result = await cloudinaryUploadImage(imagePath);
        console.log(result);

        // 4- Get the user from the DB 
        const user = await User.findById(req.user.id);


        // 5- Delete the old profile photo if it exists 
        if (user.profilePhoto.publicId) {
            // Delete the old photo from Cloudinary
            const deleteResult = await cloudinaryRemoveImage(user.profilePhoto.publicId);
            console.log("Deleted old photo result:", deleteResult);
        }

        // 6- Change the profilePhoto field in the DB 
        user.profilePhoto = {
            url: result.secure_url,
            publicId: result.public_id,
        }
        await user.save();

        // 7- Sending response to the client
        res.status(200).json({ message: 'your profile photo uploaded successfully', 
            profilePhoto: {url: result.secure_url, publicId: result.public_id }

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading photo to Cloudinary', error });
    }

    // 8- Remove image from the server 
    fs.unlinkSync(imagePath);
});
