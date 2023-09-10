import "./App.css";
import Container from "./components/container/Container";
import { useEffect, useState } from "react";
import Welcome from "./components/welcome/Welcome";
import io from "socket.io-client";
import Form from "./components/form/Form";
import ReactDOM from "react-dom";
import Waiting from "./components/waiting/Waiting";
import Option from "./components/options/Option";
import GameCanvas from "./components/GameCanvas/GameCanvas";
import leftRight from "./components/helper/leftRight";
function App() {
  const [isWelcomeClicked, setIsWelcomeClicked] = useState(false);
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("");
  const [opponent, setOpponent] = useState("");
  const [mySymbol, setMySymbol] = useState("");
  const [gates, setGates] = useState(false);
  const [gateText, setGateText] = useState({
    leftGateText: "Load",
    rightGateText: "ing...",
  });
  const [gameStarted, setGameStarted] = useState(false);
  const welcomeUpdate = () => {
    setIsWelcomeClicked(true);
    setGates(true);
  };
  const gameStartedUpdate = () => {
    setGameStarted(true);
  };
  const loading = (gateText, gateToClose) => {
    setGateText({ leftGateText: gateText.left, rightGateText: gateText.right });
    setGates(gateToClose);
  };
  const setNameFrontend = (name) => {
    setName(name);
  };
  const game = (gameStatus) => {
    setGameStarted(gameStatus);
  };
  const chooseSymbol = (symbol) => {
    setMySymbol(symbol);
  };
  const changeOpponent = (opp) => {
    setOpponent(opp);
  };
  useEffect(() => {
    const connectingToserverText = leftRight("Connecting To Servers");
    const mySocket = io("https://tictactoe-omhh.onrender.com");
    if (!socket) loading(connectingToserverText, true);
    window.addEventListener("beforeunload", function (e) {
      // if (gameStarted)
      mySocket.emit("customDisconnectEvent", {
        token: this.localStorage.getItem("token"),
      });
    });

    mySocket.on("connect", () => {
      setTimeout(() => {
        loading({ left: "Load", right: "ing..." }, false);
      }, 100);

      console.log("connect");
      setSocket(mySocket);
    });
    mySocket.on("disconnect", () => {});
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("opponentJoined", (data) => {
        console.log(name);
        setMySymbol("X");
        setOpponent(data.user);
        loading(
          {
            left: (
              <>
                <span
                  style={{
                    fontSize: "1.3rem",
                    color: "rgb(0,255,0)",
                    paddingRight: "0.5rem",
                  }}
                >
                  {name.length > 8 ? name.substring(0, 8) + "..." : name}
                </span>
                <span style={{ fontSize: "2rem", color: "white" }}> V</span>
              </>
            ),
            right: (
              <>
                <span style={{ fontSize: "2rem", color: "white" }}> S</span>
                <span
                  style={{
                    fontSize: "1.3rem",
                    color: "red",
                    paddingLeft: "0.5rem",
                  }}
                >
                  {data.user.length > 8
                    ? data.user.substring(0, 8) + "..."
                    : data.user}
                </span>
              </>
            ),
          },
          true
        );
        setTimeout(() => {
          loading({ left: null, right: null }, false);
          setGameStarted(true);
        }, 2000);
      });
    }
  }, [name, socket]);
  return (
    <>
      {gates
        ? ReactDOM.createPortal(
            <Waiting
              open={false}
              leftGateText={gateText.leftGateText}
              rightGateText={gateText.rightGateText}
            ></Waiting>,
            document.getElementById("portalRoot")
          )
        : ReactDOM.createPortal(
            <Waiting
              open={true}
              leftGateText={gateText.leftGateText}
              rightGateText={gateText.rightGateText}
            ></Waiting>,
            document.getElementById("portalRoot")
          )}
      {!gameStarted &&
        (name === "" ? (
          <Container isWelcomeClicked={isWelcomeClicked}>
            {isWelcomeClicked ? (
              <Form
                socket={socket}
                resetLoading={loading}
                setName={setNameFrontend}
              ></Form>
            ) : (
              <>
                <Welcome
                  welcomeButton={welcomeUpdate}
                  setNmae={setNameFrontend}
                ></Welcome>
              </>
            )}
          </Container>
        ) : (
          <Container>
            <Option
              resetLoading={loading}
              gameStartedUpdate={gameStartedUpdate}
              name={name}
              changeOpponent={changeOpponent}
              socket={socket}
              game={game}
              chooseSymbol={chooseSymbol}
            ></Option>
          </Container>
        ))}
      {gameStarted && (
        <GameCanvas
          mySymbol={mySymbol}
          resetLoading={loading}
          opponent={opponent}
          me={name}
          game={game}
          socket={socket}
        ></GameCanvas>
      )}
    </>
  );
}

export default App;
