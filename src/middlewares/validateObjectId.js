const mongoose = require("mongoose");

module.exports = (req,res,next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({ message: "invalid id" });
    }
    next();//if everethings is good go to the route handler 
}