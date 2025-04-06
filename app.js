require("dotenv").config({
  path: "./.env",
});
const express = require("express");
const app = express();
const morgan = require("morgan");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const ErrorHanlder = require("./utils/ErrorHandler");
const { generateErrors } = require("./middlewares/errors.middleware");

const port = process.env.PORT || 3000;

const userRouter = require("./routes/user.routes");

// database connection
require("./db/database").connectDatabase();

// morgan middleware for logging requests
app.use(morgan("dev"));

// express-session and cookie-parser
// app.use(
//   expressSession({
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.EXPRESS_SESSION_SECRET,
//   })
// );
// app.use(cookieParser());

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/users/", userRouter);

// error handling
app.all("*", (req, res, next) => {
  return next(new ErrorHanlder(`Requested URL Not Found ${req.url}`, 404));
});
app.use(generateErrors);

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
