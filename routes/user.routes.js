const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");

// /users/register
router.post(
  "/register",
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required !"),
    body("email").trim().isEmail().withMessage("Invalid email !"),
    body("password")
      .isLength({ min: 6, max: 15 })
      .withMessage("Password must be between 6 to 15 characters !"),
  ],
  userController.registerUser
);

module.exports = router;
