const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const { log } = require("console");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.BASE_URL],
  },
});
console.log(process.env.BASE_URL);

const userSocketMap = {}; //{userId:socketId}

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A User connect", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("friendRequestSent", (friendId) => {
    const receiverSocketId = getReceiverSocketId(friendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestReceived", userId);
    }
  });

  socket.on("disconnects", () => {
    console.log("A User disconnected", socket.id);
    delete userSocketMap[userId];
  });
});

module.exports = { io, app, server };
