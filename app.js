require("dotenv").config({
  path: "./.env",
});
const express = require("express");
const app = express();
const morgan = require("morgan");
const ErrorHanlder = require("./utils/ErrorHandler");
const { generateErrors } = require("./middlewares/errors.middleware");

const port = process.env.PORT || 3000;

// database connection
require("./db/database").connectDatabase();

// morgan middleware for logging requests
app.use(morgan("dev"));

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res, next) => {
  res.json({ message: "route is working !" });
});

// error handling
app.all("*", (req, res, next) => {
  return next(new ErrorHanlder(`Requested URL Not Found ${req.url}`, 404));
});

app.use(generateErrors);

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
