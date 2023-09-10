const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const signUp = require("./controllers/signUp");
const verifyToken = require("./controllers/verifyToken");
const createRoom = require("./controllers/createRoom");
const joinRoom = require("./controllers/joinRoom");
const chancePlayed = require("./controllers/chancePlayed");
const disconnectEvent = require("./controllers/disconnectEvent");
const gameOver = require("./controllers/gameOver");
const playAgainRequest = require("./controllers/playAgainReq");
const accepted = require("./controllers/accepted");
const startInitiated = require("./controllers/startInitiated");
const rejected = require("./controllers/rejected");
const exit = require("./controllers/exit");
dotenv.config({ path: "./.env" });
let c = 0;
const ip = process.env.IP || "127.0.0.1";
const port = process.env.PORT || 3000;

const DB = process.env.DATABASE_STRING.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
console.log(DB);
mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.log(err.message);
  });
const server = http.createServer(app);
// server.listen(port, ip, () => {});
const io = require("socket.io")(port, { cors: { origin: "*" } });
io.on("connect", (socket) => {
  // console.log(socket);
  socket.on("register", (data, cb) => {
    signUp(socket, data, cb);
  });
  socket.on("verifyToken", (data, cb) => {
    console.log(data);
    verifyToken(socket, data, cb);
  });
  socket.on("createRoom", (data, cb) => {
    console.log(c++);
    createRoom(socket, data, cb);
  });
  socket.on("joinRoom", (data, cb) => {
    data["io"] = io;
    joinRoom(socket, data, cb);
  });
  socket.on("chancePlayed", (data, cb) => {
    console.log("-----------ChancePlayed-------------");
    console.log(Date.now());
    chancePlayed(socket, data, cb);
  });
  socket.on("gameOver", (data, cb) => {
    console.log("-----------GameOver-------------");
    console.log(Date.now());

    gameOver(socket, data, cb);
  });
  socket.on("playAgainRequest", (data, cb) => {
    playAgainRequest(socket, data, cb);
  });
  socket.on("accepted", (data, cb) => {
    accepted(socket, data, cb);
  });
  socket.on("startInitiated", (data, cb) => {
    startInitiated(socket, data, cb);
  });
  socket.on("disconnect", () => {
    console.log(socket.rooms);
  });
  socket.on("customDisconnectEvent", (data, cb) => {
    console.log(data);
    data["io"] = io;
    disconnectEvent(socket, data, cb);
  });
  socket.on("rejected", (data, cb) => {
    data["io"] = io;
    rejected(socket, data, cb);
  });
  socket.on("exit", (data, cb) => {
    data["io"] = io;
    exit(socket, data, cb);
  });
});
