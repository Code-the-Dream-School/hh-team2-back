const router = require("express").Router();
 const { getAllUsersCtrl } = require("../controllers/usersController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");


 // api/users/profile
 router.route("/profile").get(verifyTokenAndAdmin,getAllUsersCtrl); // will check the user token and admin in one time 

 module.exports = router;