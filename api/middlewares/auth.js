function isAuthenticated(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: "Authorization is not provided"
    });
  }
  next()
}

module.exports = isAuthenticated;
