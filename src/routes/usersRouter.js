const router = require("express").Router();
 const { getAllUsersCtrl, getUserProfileCtrl, updateUserProfileCtrl, getUsersCountCtrl } = require("../controllers/usersController");
const { verifyTokenAndAdmin, verifyTokenOnlyUser } = require("../middlewares/verifyToken");
const  validateObjectId = require("../middlewares/validateObjectId");


 // api/users/profile
 router.route("/profile").get(verifyTokenAndAdmin,getAllUsersCtrl); // will check the user token and admin in one time 

 // api/users/profile/:id
 router.route("/profile/:id")// if id is wrong will send error to the client  
         .get(validateObjectId,getUserProfileCtrl)
         .put(validateObjectId,verifyTokenOnlyUser,updateUserProfileCtrl);



// api/users/count 
router.route("/count").get(verifyTokenAndAdmin,getUsersCountCtrl); 

 module.exports = router;