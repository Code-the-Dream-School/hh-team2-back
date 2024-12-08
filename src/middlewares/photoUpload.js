const path = require("path"); // Node.js module for working with file and directory paths
const multer = require("multer"); // Multer middleware for handling file uploads in Node.js

// Photo Storage Configuration
const photoStorage = multer.diskStorage({
  // 'destination' function determines the folder where uploaded files will be stored
  destination: function (req, file, cb) {
    // Setting the folder to 'images' directory located at the parent level of the current file
    cb(null, path.join(__dirname, "../../images"));//null mean i dont have error 
  },
  
  // 'filename' function defines the name of the uploaded file
  filename: function (req, file, cb) {
    // If a file is provided, create a unique name based on the current timestamp and the original file name
    if (file) {//file will come from the clenet 
      const uniqueName = new Date().toISOString().replace(/:/g, "-") + file.originalname;
      cb(null, uniqueName); // Set the unique name for the file
    } else {
      // If no file is provided, return false to reject the upload
      cb(null, false);
    }
  },
});

// Photo Upload Middleware Setup
const photoUpload = multer({
  storage: photoStorage, // Use the 'photoStorage' configuration for file storage
  // 'fileFilter' function filters the files based on type before upload only images 
  fileFilter: function (req, file, cb) {
    // Check if the file is an image by inspecting its MIME type
    if (file.mimetype.startsWith("image")) {// i can also use image/jpg or any 
      // If the file is an image, allow the upload
      cb(null, true);
    } else {
      // If the file is not an image, reject the upload and return an error message
      cb({ message: "Unsupported file format" }, false);//Only image files are allowed
    }
  },
  // Limits the file size to 1MB (1024 * 1024 bytes)
  limits: { fileSize: 1024 * 1024 },// 1024 * 2 = 2MB
});

// Export the middleware for use in other files
module.exports = photoUpload;
