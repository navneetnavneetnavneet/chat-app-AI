const {
  catchAsyncError,
} = require("../middlewares/catchAsyncError.middleware");
const ErrorHandler = require("../utils/ErrorHandler");
const aiService = require("../services/ai.service");

module.exports.getResult = catchAsyncError(async (req, res, next) => {
  const { prompt } = req.query;
  const result = await aiService.generateResult(prompt);

  res.send(result);
});
