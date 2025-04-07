const {
  catchAsyncError,
} = require("../middlewares/catchAsyncError.middleware");
const ErrorHandler = require("../utils/ErrorHandler");
const projectService = require("../services/project.service");
const projectModel = require("../models/project.model");
const { validationResult } = require("express-validator");

module.exports.createProject = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { projectName } = req.body;
  const userId = req._id;

  const newProject = await projectService.createProject({
    projectName,
    userId,
  });

  res.status(201).json(newProject);
});

module.exports.getAllProjects = catchAsyncError(async (req, res, next) => {
  const userId = req._id;

  const projects = await projectService.getAllProjectsByUserId(userId);

  if (!projects) {
    return next(new ErrorHandler("No projects found !", 404));
  }

  res.status(200).json(projects);
});
