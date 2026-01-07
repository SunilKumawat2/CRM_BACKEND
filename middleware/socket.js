// middleware/socket.js
let io = null;

/**
 * Initialize Socket.IO
 * @param {http.Server} server - The HTTP server
 */
const initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
};

/**
 * Get the Socket.IO instance anywhere
 */
const getIo = () => {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
};

module.exports = { initSocket, getIo };
