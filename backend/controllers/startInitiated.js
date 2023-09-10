const checkLogin = require("../utils/helpers/checkLogin");

const startInitiated = async (socket, data, cb) => {
  try {
    await checkLogin(socket, process.env.USER_JWT_SECRET, data.token);
    socket.emit("startGame");
    socket.to(socket.user.room).emit("startGame");
  } catch (err) {
    console.log(err.message);
  }
};
module.exports = startInitiated;
