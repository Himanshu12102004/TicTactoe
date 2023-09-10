function disconnectSocketFromAllRooms(socket) {
  const rooms = Array.from(socket.rooms);
  socket.leave(rooms[1]);
}
module.exports = disconnectSocketFromAllRooms;
