const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");

// POST /projects/create
router.post(
  "/create",
  authMiddleware.isAuthenticated,
  body("projectName")
    .isString()
    .notEmpty()
    .withMessage("Project Name is required !"),
  projectController.createProject
);

// POST /projects/all
router.post(
  "/all",
  authMiddleware.isAuthenticated,
  projectController.getAllProjects
);

// PUT /projects/addd-user
router.put(
  "/add-user",
  authMiddleware.isAuthenticated,
  body("projectId").isString().withMessage("PeojectId must be string !"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be a non-empty array.")
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("Each user must be a string."),
  projectController.addUserToProject
);

module.exports = router;
