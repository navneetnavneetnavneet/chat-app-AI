const {
  catchAsyncError,
} = require("../middlewares/catchAsyncError.middleware");
const { validationResult } = require("express-validator");
const ErrorHandler = require("../utils/ErrorHandler");
const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { sendToken } = require("../utils/SendToken");

module.exports.registerUser = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;

  const user = await userService.createUser({ fullName, email, password });

  sendToken(user, 201, res);
});
