function getNumberOfClientsInRoom(io, roomName) {
  const room = io.sockets.adapter.rooms.get(roomName);
  if (room) {
    console.log(room);
    return Array.from(room).length;
  }
  return 0; // Room does not exist or no clients in the room
}
module.exports = getNumberOfClientsInRoom;
