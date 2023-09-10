const mongoose = require("mongoose");
const schema = mongoose.Schema({
  name: { type: String },
  room: { type: String, default: "" },
  previousMatches: [
    {
      opponent: { type: String, hasWon: { type: Boolean } },
    },
  ],
});
module.exports = mongoose.model("heman", schema);
