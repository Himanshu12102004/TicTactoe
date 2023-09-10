const checkLogin = require("../utils/helpers/checkLogin");

const playAgainRequest = async (socket, data, cb) => {
  try {
    await checkLogin(socket, process.env.USER_JWT_SECRET, data.token);
    socket
      .to(socket.user.room)
      .emit("playAgainRequestConfirmation", "helloFuck u");
  } catch (err) {
    console.log(err.message);
  }
};
module.exports = playAgainRequest;
