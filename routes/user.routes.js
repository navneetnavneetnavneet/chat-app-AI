const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// POST /users/register
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

// POST /users/login
router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Invalid email !"),
    body("password")
      .isLength({ min: 6, max: 15 })
      .withMessage("Password must be between 6 to 15 characters !"),
  ],
  userController.loginUser
);

// GET /users/profile
router.get(
  "/profile",
  authMiddleware.isAuthenticated,
  userController.loggedInUser
);

// GET /users/logout
router.get("/logout", userController.logoutUser);

module.exports = router;
