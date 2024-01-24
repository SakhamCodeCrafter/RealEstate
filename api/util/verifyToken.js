const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const token = req.cookies.jwtoken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      const statusCode = err.name === "TokenExpiredError" ? 401 : 403;
      return res.status(statusCode).json({ success: false, message: err.message });
    }

    req.user = user;
    next();
  });
};
