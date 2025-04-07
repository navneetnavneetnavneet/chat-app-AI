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

module.exports = router;
