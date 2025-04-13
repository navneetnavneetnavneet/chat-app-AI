require("dotenv").config({
  path: "./.env",
});
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("./utils/ErrorHandler");
const mongoose = require("mongoose");
const projectModel = require("./models/project.model");
const { generateResult } = require("./services/ai.service");

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new ErrorHandler("Invalid projectId !", 400));
    }

    socket.project = await projectModel.findById(projectId);

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
  socket.roomId = socket.project._id.toString();
  console.log("A user connected");

  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
    const message = data.message;
    let aiIsPresentInMessage = message.includes("@ai");

    if (aiIsPresentInMessage) {
      console.log("Ai in included in message.");

      const prompt = message.replace("@ai", "");
      const result = await generateResult(prompt);

      io.to(socket.roomId).emit("project-message", {
        message: result,
        sender: {
          _id: "ai",
          email: "AI",
        },
      });

      return;
    }

    socket.broadcast.to(socket.roomId).emit("project-message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(socket.roomId);
  });
});

// start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
