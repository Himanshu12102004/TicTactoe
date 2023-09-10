const roomsSchema = require("../models/roomsSchema");
const userSchema = require("../models/userSchema");
const callBack = require("../utils/helpers/callBack");
const checkLogin = require("../utils/helpers/checkLogin");
const generateRandomSixDigitNumber = require("../utils/helpers/createRandomRooms");
const disconnectSocketFromAllRooms = require("../utils/helpers/removeFromAllRooms");
const Response = require("../utils/helpers/respose");
const createRoom = async (socket, data, cb) => {
  try {
    await checkLogin(socket, process.env.USER_JWT_SECRET, data.token);
    disconnectSocketFromAllRooms(socket);
    const roomCode = generateRandomSixDigitNumber();
    socket.join(roomCode);
    await userSchema.updateOne(
      { _id: socket.user._id },
      { $set: { room: roomCode } }
    );
    await roomsSchema.create({
      roomCode,
      players: {
        playerOne: { _id: socket.user._id, name: socket.user.name },
        playerTwo: { _id: "", name: "" },
      },
    });
    const response = new Response("success", true, { roomCode }, null);
    callBack(response, cb);
  } catch (err) {
    const response = new Response("fail", false, null, err.message);
    callBack(response, cb);
  }
};
module.exports = createRoom;
