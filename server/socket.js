let io;

function initSocket(server) {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
  });
}

function emitSettingUpdate(data) {
  if (io) {
    console.log("data of socket", data);
    io.emit("adminSettingUpdate", data);
  } else {
    console.warn("Socket.IO not initialized");
  }
}

module.exports = { initSocket, emitSettingUpdate };
