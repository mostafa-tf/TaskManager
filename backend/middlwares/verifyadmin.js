const verifyadmin = (req, res, next) => {
  if (req.user.role != "admin") {
    return res
      .status(403)
      .json({ message: "permission blocked You Must be an Admin" });
  }
  next();
};
module.exports = verifyadmin;
