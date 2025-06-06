const express = require("express");
const app = express();
const morgan = require("morgan");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const ErrorHanlder = require("./utils/ErrorHandler");
const { generateErrors } = require("./middlewares/errors.middleware");
const cors = require("cors");

const userRouter = require("./routes/user.routes");
const projectRouter = require("./routes/project.routes");
const aiRouter = require("./routes/ai.routes");

// database connection
require("./db/database").connectDatabase();

// cors
app.use(cors({ origin: process.env.REACT_BASE_URL, credentials: true }));

// morgan middleware for logging requests
app.use(morgan("dev"));

// express-session and cookie-parser
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(cookieParser());

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/users/", userRouter);
app.use("/projects/", projectRouter);
app.use("/ai", aiRouter);

// error handling
app.all("*", (req, res, next) => {
  return next(new ErrorHanlder(`Requested URL Not Found ${req.url}`, 404));
});
app.use(generateErrors);

module.exports = app;
