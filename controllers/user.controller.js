const {
  catchAsyncError,
} = require("../middlewares/catchAsyncError.middleware");
const { validationResult } = require("express-validator");
const ErrorHandler = require("../utils/ErrorHandler");
const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { sendToken } = require("../utils/SendToken");
const redisClient = require("../services/redis.service");

module.exports.registerUser = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;

  const user = await userService.createUser({ fullName, email, password });

  sendToken(user, 201, res);
});

module.exports.loginUser = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password !", 401));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password !", 401));
  }

  sendToken(user, 200, res);
});

module.exports.loggedInUser = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req._id);

  res.status(200).json(user);
});

module.exports.logoutUser = catchAsyncError(async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  redisClient.set(token, "logout", "EX", 60 * 60 * 24);

  res.status(200).json({
    success: true,
    message: "Logout user successfully",
  });
});
