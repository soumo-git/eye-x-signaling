const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins — adjust in production
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on("join", (roomId) => {
    console.log(`📡 Client ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).emit("peer-joined");
  });

  socket.on("signal", ({ roomId, data }) => {
    console.log(`🔁 Signal from ${socket.id} to room ${roomId}: ${JSON.stringify(data)}`);
    socket.to(roomId).emit("signal", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Signaling server running on port ${PORT}`);
});
