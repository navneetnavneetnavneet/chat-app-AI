const express = require("express");
const app = express();
const morgan = require("morgan");

const port = process.env.PORT || 3000;

// morgan middleware for logging requests
app.use(morgan("dev"));

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res, next) => {
  res.json({message: "route is working !"});
})

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
