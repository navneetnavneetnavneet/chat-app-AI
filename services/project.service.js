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
