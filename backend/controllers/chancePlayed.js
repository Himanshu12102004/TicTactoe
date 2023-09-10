const roomsSchema = require("../models/roomsSchema");
const callBack = require("../utils/helpers/callBack");
const checkLogin = require("../utils/helpers/checkLogin");
const gameWin = require("../utils/helpers/gameWin");
const Response = require("../utils/helpers/respose");
const chancePlayed = async (socket, data, cb) => {
  try {
    await checkLogin(socket, process.env.USER_JWT_SECRET, data.token);
    console.log(socket.user);
    const room = await roomsSchema.findOne({ roomCode: socket.user.room });
    const game = room.game;
    console.log(room);
    game[data.position.x][data.position.y] = data.mySymbol;
    await roomsSchema.updateOne(
      { roomCode: socket.user.room },
      { $set: { game: game } }
    );
    const response = new Response(
      "success",
      true,
      "dataSentSuccessfully",
      null
    );
    console.log(response);
    callBack(response, cb);
    // console.log(gameWin(game));

    console.log("-----------------ChanceReceived-----------------");
    console.log(Date.now());
    socket.to(socket.user.room).emit("chanceReceived", { game });
  } catch (err) {
    const response = new Response("fail", false, null, err.message);
    callBack(response, cb);
    console.log(err);
  }
};
module.exports = chancePlayed;
