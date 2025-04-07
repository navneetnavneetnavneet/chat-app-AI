module.exports.generateErrors = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (
    err.errName === "MongoServerError" ||
    err.message.includes("E11000 duplicate key error collection")
  ) {
    err.message = "Project name must be unique !";
  }

  res.status(statusCode).json({
    message: err.message,
    errName: err.name,
    // stack: err.stack,
  });
};
