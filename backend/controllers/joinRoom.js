const roomsSchema = require("../models/roomsSchema");
const userSchema = require("../models/userSchema");
const callBack = require("../utils/helpers/callBack");
const checkLogin = require("../utils/helpers/checkLogin");
const getNumberOfClientsInRoom = require("../utils/helpers/getNoOfClients");
const disconnectSocketFromAllRooms = require("../utils/helpers/removeFromAllRooms");
const Response = require("../utils/helpers/respose");

const joinRoom = async (socket, data, cb) => {
  try {
    // console.log(data);
    disconnectSocketFromAllRooms(socket);
    await checkLogin(socket, process.env.USER_JWT_SECRET, data.token);
    const noOfMembers = getNumberOfClientsInRoom(data.io, data.roomCode);
    if (noOfMembers === 1) {
      socket.join(data.roomCode);
      console.log("himanshu");
      const room = data.io.sockets.adapter.rooms.get(data.roomCode);

      await userSchema.updateOne(
        { _id: socket.user._id },
        { $set: { room: data.roomCode } }
      );
      await roomsSchema.updateOne(
        { roomCode: data.roomCode },
        {
          $set: {
            "players.playerTwo": {
              name: socket.user.name,
              _id: socket.user._id,
            },
          },
        }
      );
      socket
        .to(data.roomCode)
        .emit("opponentJoined", { user: socket.user.name, hello: "hello" });
      console.log(room);
    } else if (noOfMembers === 0) {
      throw new Error("No such room");
    } else {
      throw new Error("room already full");
    }

    const response = new Response(
      "success",
      true,
      {
        opponent: (await roomsSchema.findOne({ roomCode: data.roomCode }))
          .players.playerOne.name,
      },
      null
    );
    callBack(response, cb);
  } catch (err) {
    const response = new Response("fail", false, null, err.message);
    callBack(response, cb);
  }
};
module.exports = joinRoom;
