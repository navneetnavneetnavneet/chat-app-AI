const mongoose = require("mongoose");
const projectModel = require("../models/project.model");

module.exports.createProject = async ({ projectName, userId }) => {
  if (!projectName) {
    throw new Error("Project Name is required !");
  }

  if (!userId) {
    throw new Error("userId is required !");
  }

  const project = await projectModel.create({
    projectName,
    users: [userId],
  });

  return project;
};

module.exports.getAllProjectsByUserId = async (userId) => {
  if (!userId) {
    throw new Error("userId is required !");
  }

  const allProjects = await projectModel.find({ users: userId });

  if (!allProjects) {
    throw new Error("No projects found !");
  }

  return allProjects;
};

module.exports.addUserToProject = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("projectId is required !");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId !");
  }

  if (!users) {
    throw new Error("users are required !");
  }

  if (
    !Array.isArray(users) ||
    users.some((userId) => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    throw new Error("Invalid userId(s) in users array !");
  }

  if (!userId) {
    throw new Error("userId is required !");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId !");
  }

  const project = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });

  if (!project) {
    throw new Error("User not belong to this project !");
  }

  const updatedProject = await projectModel.findOneAndUpdate(
    { _id: projectId },
    {
      $addToSet: {
        users: {
          $each: users,
        },
      },
    },
    { new: true }
  );

  return updatedProject;
};
