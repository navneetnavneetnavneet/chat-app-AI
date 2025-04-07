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
    if(!userId){
        throw new Error("userId is required !")
    }

    const allProjects = await projectModel.find({ users: userId });

    if (!allProjects) {
        throw new Error("No projects found !")
    }

    return allProjects;
}
