const router = require("express").Router();
 const { getAllUsersCtrl, getUserProfileCtrl, updateUserProfileCtrl, getUsersCountCtrl } = require("../controllers/usersController");
 const { changePasswordCtrl } = require("../controllers/changePasswordController");
 const { PhotoUploadCtrl  } = require("../controllers/photoController");
const { verifyTokenAndAdmin, verifyTokenOnlyUser, verifyToken } = require("../middlewares/verifyToken");
const  validateObjectId = require("../middlewares/validateObjectId");
const photoUpload = require("../middlewares/photoUpload");


 // api/users/profile
 router.route("/profile").get(verifyTokenAndAdmin,getAllUsersCtrl); // will check the user token and admin in one time 

 // api/users/profile/:id
 router.route("/profile/:id")// if id is wrong will send error to the client  
         .get(validateObjectId,getUserProfileCtrl)
         .put(validateObjectId,verifyTokenOnlyUser,updateUserProfileCtrl);

// api/users/photo-upload
router.route("/photo-upload") 
.post(verifyToken, photoUpload.single("image"), PhotoUploadCtrl)



// api/users/change-password/:id
router.route("/change-password/:id")
  .put(validateObjectId, verifyTokenOnlyUser, changePasswordCtrl); 


// api/users/count 
router.route("/count").get(verifyTokenAndAdmin,getUsersCountCtrl); 

 module.exports = router;

 