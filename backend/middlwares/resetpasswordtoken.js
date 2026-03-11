const jwt = require("jsonwebtoken");
const dotenvv = require("dotenv");
dotenvv.config();

const resetpasswordtoken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(404).json({ message: "no token provided in headers" });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "unvalid token " });
  }
};
module.exports = resetpasswordtoken;
