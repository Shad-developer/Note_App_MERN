const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // const authHeader= req.headers["authorization"]; 
  // const token = authHeader && authHeader.split(" ")[1];
  const token = req.cookies.token;
// console.log(token);
  if (!token) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ error: true, message: "Token verification failed" });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
