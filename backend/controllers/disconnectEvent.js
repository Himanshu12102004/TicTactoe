const checkLogin = require("../utils/helpers/checkLogin");

const disconnectEvent = async (socket, data, cb) => {
  try {
    console.log(data.token);
    await checkLogin(socket, process.env.USER_JWT_SECRET, data.token);
    const roomName = socket.user.room;
    const room = data.io.sockets.adapter.rooms.get(roomName);
    if (room) {
      // Get an array of socket IDs in the room
      const socketIds = Array.from(room);
      socket.to(socket.user.room).emit("userDisconnected");

      // Iterate through socket IDs and force them to leave the room
      socketIds.forEach((socketId) => {
        const socket = data.io.sockets.sockets.get(socketId);
        if (socket) {
          socket.leave(roomName);
          console.log(`User ${socketId} has left room ${roomName}`);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = disconnectEvent;
