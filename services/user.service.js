const userModel = require("../models/user.model");

module.exports.createUser = async ({ fullName, email, password }) => {
  if (!fullName || !email || !password) {
    throw new Error("All fields are required !");
  }

  const user = await userModel.create({
    fullName,
    email,
    password,
  });

  return user;
};

module.exports.getAllUsers = async (userId) => {
  if (!userId) {
    throw new Error("userId is required !");
  }

  const allUsers = await userModel.find({ _id: { $ne: userId } });

  return allUsers;
};
