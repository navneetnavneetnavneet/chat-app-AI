require("dotenv").config({
  path: "./.env",
});
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("./utils/ErrorHandler");

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new ErrorHandler("Authentication error", 401));
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new ErrorHandler("Authentication error", 401));
    }
    
    socket._id = decoded;
    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("event", (data) => {
    /* … */
  });
  socket.on("disconnect", () => {
    /* … */
  });
});

// start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
