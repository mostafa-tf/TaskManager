const jwt = require("jsonwebtoken");
const dotenvv = require("dotenv");
dotenvv.config();

const verifytoken = (req, res, next) => {
  let completetoken = req.headers.authorization;
  if (!completetoken) {
    return res.status(401).json({ message: "you must send token also " });
  }
  try {
    let arraytoken = completetoken.split(" ");

    const decoded = jwt.verify(arraytoken[1], process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "unvalid token " });
  }
};

module.exports = verifytoken;
