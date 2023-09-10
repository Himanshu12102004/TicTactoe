const mongoose = require("mongoose");
const roomSchema = mongoose.Schema({
  roomCode: { type: String, required: true },
  players: {
    type: {
      playerOne: { name: { type: String }, _id: { type: String } },
      playerTwo: { name: { type: String }, _id: { type: String } },
    },
  },
  game: {
    type: [[], [], []],
    default: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
  },
});
module.exports = mongoose.model("room", roomSchema);
