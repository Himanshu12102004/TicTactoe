const checkLogin = require("../utils/helpers/checkLogin");
const chancePlayed = require("./chancePlayed");

const gameOver = async (socket, data, cb) => {
  try {
    await checkLogin(socket, process.env.USER_JWT_SECRET, data.token);
    const roomCode = socket.user.room;
    // chancePlayed(socket, data, cb);
    // console.log(chancePlayed)
    socket.to(roomCode).emit("result", data.status);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = gameOver;
