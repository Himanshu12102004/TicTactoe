import React, { useEffect, useState } from "react";
import "./gameCanvas.css";
import gameWin from "../helper/gameWin";
import ReactDOM from "react-dom";
import Canvas from "../canvas/Canvas";
import trimmer from "../helper/trimmer";
import leftRight from "../helper/leftRight";
function GameCanvas(props) {
  const [chance, setChance] = useState("");
  const [gameCounter, setGameCounter] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [myCanvas, setMyCanvas] = useState("");
  const [confirmationInitiated, setConfirmationInitiated] = useState(false);
  useEffect(() => {
    console.log(gameCounter);
    if (gameCounter % 2 === 0) {
      if (props.mySymbol === "X") {
        setChance(true);
        othersChance(false);
      } else if (props.mySymbol === "O") {
        setChance(false);
        othersChance(true);
      }
    } else {
      if (props.mySymbol === "X") {
        setChance(false);
        othersChance(true);
      } else if (props.mySymbol === "O") {
        setChance(true);
        othersChance(false);
      }
    }
  }, [gameCounter]);
  const draw = (win, row, column, hasWon) => {
    setMyCanvas(
      ReactDOM.createPortal(
        <Canvas
          canvasData={{
            width: 2,
            row: row,
            column: column,
            diagonal: null,
            win: win,
            hasWon: hasWon,
          }}
          winLoseGates={winLoseGates}
        ></Canvas>,
        document.getElementById("canvasRoot")
      )
    );
  };
  const exit = () => {
    props.socket.emit("exit", { token: localStorage.getItem("token") });
    props.resetLoading({ left: null, right: null }, false);

    props.game(false);
  };
  const requestAccepted = () => {
    props.resetLoading(
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
              {trimmer(props.me, 8)}
            </span>
            <span style={{ fontSize: "2rem", color: "white" }}> V</span>
            {/* <div
              style={{
                color: "rgb(0,255,0)",
                textAlign: "center",
                fontFamily: "sans-serif",
                fontSize: "2rem",
              }}
            >
              <div>{props.mySymbol}</div>
            </div> */}
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
              {trimmer(props.opponent, 8)}
            </span>
            {/* <div
              style={{
                color: "rgb(0,255,0)",
                textAlign: "center",
                fontFamily: "sans-serif",
                fontSize: "2rem",
              }}
            >
              {props.mySymbol === "X" ? <div>O</div> : <div>X</div>}
            </div> */}
          </>
        ),
      },
      true
    );

    props.socket.emit("accepted", { token: localStorage.getItem("token") });
  };
  const requestRejected = () => {
    props.socket.emit("rejected", { token: localStorage.getItem("token") });
    setTimeout(() => {
      props.game(false);
      props.resetLoading({ left: null, right: null }, false);
    }, 0);
  };
  const othersChance = (closeGates) => {
    const othersChanceText = leftRight(
      `${trimmer(props.opponent, 8)}'s chance`
    );
    props.resetLoading(
      {
        left: (
          <>
            <div style={{ fontSize: "1.6rem" }}>{othersChanceText.left}</div>
          </>
        ),
        right: (
          <>
            <div style={{ fontSize: "1.6rem" }}>{othersChanceText.right}</div>
          </>
        ),
      },
      closeGates
    );
  };
  const playAgain = () => {
    setConfirmationInitiated(true);
    const requestSentText = leftRight("Request Sent");
    props.resetLoading(
      {
        left: (
          <>
            <div>{requestSentText.left}</div>
          </>
        ),
        right: (
          <>
            <div>{requestSentText.right}</div>
          </>
        ),
      },
      true
    );
    props.socket.emit("playAgainRequest", {
      token: localStorage.getItem("token"),
    });
  };
  const winLoseGates = ({ left, right }) => {
    const playAgainBtnText = leftRight(
      `Play again with ${trimmer(props.opponent, 8)}`
    );
    props.resetLoading(
      {
        left: (
          <>
            <div
              style={{
                color:
                  right === "Win"
                    ? "rgb(0,255,0)"
                    : right === "  Tied"
                    ? "yellow"
                    : "red",
                fontSize: "2rem",

                textAlign: "right",
                paddingRight: "8px",
              }}
            >
              {left}
            </div>
            <button onClick={playAgain} className="playAgainBtn left">
              {playAgainBtnText.left}
            </button>
            <br />
            <div>
              <button onClick={exit} className="playAgainBtn left exit">
                EX
              </button>
            </div>
          </>
        ),
        right: (
          <>
            <div
              style={{
                color:
                  right === "Win"
                    ? "rgb(0,255,0)"
                    : right === "  Tied"
                    ? "yellow"
                    : "red",
                fontSize: "2rem",
                textAlign: "left",
                paddingRight: "6px",
              }}
            >
              {right}
            </div>
            <button onClick={playAgain} className="playAgainBtn right">
              {playAgainBtnText.right}
            </button>
            <br />
            <div style={{ textAlign: "left" }}>
              <button onClick={exit} className="playAgainBtn right exit">
                IT
              </button>
            </div>
          </>
        ),
      },
      true
    );
  };
  useEffect(() => {
    props.socket.on("chanceReceived", (data) => {
      setGameStatus(data.game);
      setChance(true);
    });
    props.socket.on("requestRejected", () => {
      const requestRejectedText = leftRight("Request Rejected");
      props.resetLoading(
        {
          left: (
            <div style={{ color: "rgb(252,0,0)" }}>
              {requestRejectedText.left}
            </div>
          ),
          right: (
            <div style={{ color: "rgb(252,0,0)" }}>
              {requestRejectedText.right}
            </div>
          ),
        },
        true
      );
      setTimeout(() => {
        props.game(false);
        props.resetLoading({ left: null, right: null }, false);
      }, 1000);
    });
    props.socket.on("startGame", () => {
      setGameOver(false);
      setGameStatus([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);
      setMyCanvas("");

      setGameCounter((prev) => {
        return prev + 1;
      });

      setConfirmationInitiated(false);
    });
    props.socket.on("requestAccepted", () => {
      const requestAcceptedText = leftRight("Request Accepted");
      props.resetLoading(
        {
          left: (
            <div style={{ color: "rgb(0,255,0)" }}>
              {requestAcceptedText.left}
            </div>
          ),
          right: (
            <div style={{ color: "rgb(0,255,0)" }}>
              {requestAcceptedText.right}
            </div>
          ),
        },
        true
      );
      setTimeout(() => {
        props.resetLoading(
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
                  {trimmer(props.me, 6)}
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
                  {trimmer(props.opponent, 6)}
                </span>
              </>
            ),
          },
          true
        );
        setTimeout(() => {
          props.socket.emit("startInitiated", {
            token: localStorage.getItem("token"),
          });
        }, 500);
      }, 500);
    });
    props.socket.on("playAgainRequestConfirmation", (data) => {
      if (!confirmationInitiated) {
        const playAgainText = leftRight(
          `${trimmer(props.opponent, 8)} wants to play again`
        );
        props.resetLoading(
          {
            left: (
              <>
                <div className="confirm">{playAgainText.left}</div>
                <div style={{ textAlign: "center" }}>
                  <button className="accepted" onClick={requestAccepted}>
                    Accept
                  </button>
                </div>
              </>
            ),
            right: (
              <>
                <div className="confirm">{playAgainText.right}</div>
                <div style={{ textAlign: "center" }}>
                  <button className="rejected" onClick={requestRejected}>
                    Reject
                  </button>
                </div>
              </>
            ),
          },
          true
        );
      }
    });
    props.socket.on("result", (data) => {
      setGameOver(true);
      if (!data.tied) {
        setTimeout(() => {
          draw(data.wonIn, data.row, data.column, false);
        }, 1000);
      }
      setTimeout(() => {
        if (data.tied) {
          winLoseGates({ left: "Match", right: "  Tied" });
        } else {
          winLoseGates({ left: "You", right: "Lose" });
        }
      }, 2000);
    });

    props.socket.on("userDisconnected", () => {
      const disconnectText = leftRight(
        `${trimmer(props.opponent, 8)} Disconnected`
      );
      props.resetLoading(
        {
          left: (
            <>
              <div style={{ fontSize: "1.5rem", color: "red" }}>
                {disconnectText.left}
              </div>
            </>
          ),
          right: (
            <>
              <div style={{ fontSize: "1.5rem", color: "red" }}>
                {disconnectText.right}
              </div>
            </>
          ),
        },
        true
      );
      setTimeout(() => {
        props.game(false);
        props.resetLoading({ left: null, right: null }, false);
      }, 2000);
    });
  }, []);
  useEffect(() => {
    if (chance === false) {
      othersChance(true);
    } else othersChance(false);
  }, [chance]);

  const clicked = (position) => {
    if (gameStatus[position.x][position.y] === "") {
      if (chance && !gameOver) {
        let gameDuplicate = [...gameStatus];
        gameDuplicate[position.x][position.y] = props.mySymbol;
        const winStatus = gameWin(gameDuplicate, props.mySymbol);
        props.socket.emit(
          "chancePlayed",
          {
            token: localStorage.getItem("token"),
            position,
            mySymbol: props.mySymbol,
          },
          (response) => {}
        );
        if (winStatus.status || winStatus.tied) {
          props.socket.emit(
            "gameOver",
            { status: winStatus, token: localStorage.getItem("token") },
            (res) => {}
          );
          if (!winStatus.tied) {
            draw(winStatus.wonIn, winStatus.row, winStatus.column, true);
          } else {
            winLoseGates({ left: "Match", right: "  Tied" });
          }
          setGameOver(true);
        } else {
          setChance(false);
        }

        setGameStatus((prev) => {
          prev[position.x][position.y] = props.mySymbol;
          return prev;
        });
      }
    }
  };
  return (
    <div>
      {myCanvas}
      <div className="welcomeText">Tic Tac Toe Neon</div>
      <div className="himanshu">By Himanshu</div>
      <div className="opponent">You VS {trimmer(props.opponent, 15)}</div>
      {chance && <div className="chance">It's Your Chance</div>}
      <div className="canvas">
        <div
          className={`item a1 ${
            gameStatus[0][0] === props.mySymbol ? "green" : "red"
          }`}
          onClick={() => {
            clicked({ x: 0, y: 0 });
          }}
        >
          {gameStatus[0][0]}
        </div>
        <div
          className={`item a2 ${
            gameStatus[0][1] === props.mySymbol ? "green" : "red"
          }`}
          onClick={() => {
            clicked({ x: 0, y: 1 });
          }}
        >
          {gameStatus[0][1]}
        </div>
        <div
          className={`item a3 ${
            gameStatus[0][2] === props.mySymbol ? "green" : "red"
          }`}
          onClick={() => {
            clicked({ x: 0, y: 2 });
          }}
        >
          {gameStatus[0][2]}
        </div>
        <div
          className={`item a4 ${
            gameStatus[1][0] === props.mySymbol ? "green" : "red"
          }`}
          onClick={() => {
            clicked({ x: 1, y: 0 });
          }}
        >
          {gameStatus[1][0]}
        </div>
        <div
          className={`item a5 ${
            gameStatus[1][1] === props.mySymbol ? "green" : "red"
          }`}
          onClick={() => {
            clicked({ x: 1, y: 1 });
          }}
        >
          {gameStatus[1][1]}
        </div>
        <div
          className={`item a6 ${
            gameStatus[1][2] === props.mySymbol ? "green" : "red"
          }`}
          onClick={() => {
            clicked({ x: 1, y: 2 });
          }}
        >
          {gameStatus[1][2]}
        </div>
        <div
          className={`item a7 ${
            gameStatus[2][0] === props.mySymbol ? "green" : "red"
          }`}
          onClick={() => {
            clicked({ x: 2, y: 0 });
          }}
        >
          {gameStatus[2][0]}
        </div>
        <div
          className={`item a8 ${
            gameStatus[2][1] === props.mySymbol ? "green" : "red"
          }`}
          onClick={() => {
            clicked({ x: 2, y: 1 });
          }}
        >
          {gameStatus[2][1]}
        </div>
        <div
          className={`item a9 ${
            gameStatus[2][2] === props.mySymbol ? "green" : "red"
          }`}
          onClick={() => {
            clicked({ x: 2, y: 2 });
          }}
        >
          {gameStatus[2][2]}
        </div>
      </div>
    </div>
  );
}

export default GameCanvas;
