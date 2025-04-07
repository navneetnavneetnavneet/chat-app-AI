const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const redisClient = require("../services/redis.service");

module.exports.isAuthenticated = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("Unauthorized User !", 401));
  }

  const isBlackListed = await redisClient.get(token);

  if (isBlackListed) {
    res.cookie("token", "");
    return next(new ErrorHandler("Unauthorized User !", 401));
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req._id = decoded._id;
    next();
  } catch (error) {
    return next(new ErrorHandler("Unauthorized User !", 401));
  }
};
