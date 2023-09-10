const roomsSchema = require("../models/roomsSchema");
const checkLogin = require("../utils/helpers/checkLogin");

const accepted = async (socket, data, cb) => {
  try {
    await checkLogin(socket, process.env.USER_JWT_SECRET, data.token);
    await roomsSchema.updateOne(
      { roomCode: socket.user.room },
      {
        $set: {
          game: [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
          ],
        },
      }
    );
    socket.to(socket.user.room).emit("requestAccepted");
  } catch (err) {
    console.log(err.message);
  }
};
module.exports = accepted;
