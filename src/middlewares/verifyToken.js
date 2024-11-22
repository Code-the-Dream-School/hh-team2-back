const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedPayload;
      next(); // mean go to the next middleware
    } catch (error) {
      return res.status(401).json({ message: "invalid token, access denied" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "no token provided, access denied" });
  }
}

// Verify Token & Admin
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {  //is anonymous next()
      if (req.user.isAdmin) {
        next();
      } else {
        return res.status(403).json({message: "not allowed, only admin is allowed to access the data"})
      }
    });
  }

 
 
  


module.exports = {
    verifyToken,
    verifyTokenAndAdmin
    
  };