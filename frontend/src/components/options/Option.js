import React, { useState } from "react";
import styles from "./option.module.css";
import CopyButton from "../copyBtn/Copy";
import trimmer from "../helper/trimmer";
import leftRight from "../helper/leftRight";

function Option(props) {
  const [joinRoom, setJoinRoom] = useState(false);
  const [join, setJoin] = useState("Join Room");
  const [roomCodeValid, setRoomCodeValid] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [err, setErr] = useState("");
  const [isErr, setIsErr] = useState(false);
  const [isSentRoomLoading, setIsSentRoomLoading] = useState(false);
  const [isRoomCodeRequested, setIsRoomCodeRequested] = useState(false);
  const [sentRoomCode, setSentRoomCode] = useState("Loading...");
  const [createErr, setCreateErr] = useState("");
  const [isCreateErr, setIsCreateErr] = useState(false);
  const [isJoinRoomLoading, setIsJoinRoomLoading] = useState(false);
  const [style, setStyles] = useState({ color: "red" });
  const createRoom = () => {
    setRoomCode("");
    setJoin("Join Room");
    setRoomCodeValid(false);
    setErr("");
    setIsErr(false);
    setJoinRoom(false);
    setIsRoomCodeRequested(true);
    setSentRoomCode("Loading...");
    if (!isSentRoomLoading) {
      setIsSentRoomLoading(true);
      props.socket.emit(
        "createRoom",
        { token: localStorage.getItem("token") },
        (response) => {
          setIsSentRoomLoading(false);
          if (response.success) {
            setSentRoomCode(response.message.roomCode);
            const waitingText = leftRight("Waiting for Opponent...");
            const shareText = leftRight("Share Room Code");
            props.resetLoading(
              {
                left: (
                  <div>
                    <div className="wait left">{waitingText.left} </div>
                    <div className="left">{shareText.left}</div>
                    <div className="roomCodeDisp" style={{ textAlign: "left" }}>
                      {response.message.roomCode}
                    </div>
                  </div>
                ),
                right: (
                  <div>
                    <div className="wait right">{waitingText.right} </div>
                    <div className="right">{shareText.right}</div>
                    <div className="cpyBtn">
                      <CopyButton
                        textToCopy={response.message.roomCode}
                      ></CopyButton>
                    </div>
                  </div>
                ),
              },
              true
            );
            setIsCreateErr(false);
          } else {
            setCreateErr(response.errMessage);
            setIsCreateErr(true);
          }
        }
      );
    }
  };
  const changeRoomCode = (e) => {
    const value = e.target.value;
    setRoomCode(value);
    const isValid = /^\d{6}$/.test(value);

    setRoomCodeValid(isValid);
    if (isValid === false) {
      setErr("Invalid Room");
      setIsErr(true);
    } else {
      setIsErr(false);
    }
  };

  const joinRoomRequest = () => {
    setJoinRoom(true);
    setJoin("Join");

    setIsRoomCodeRequested(false);
    if (roomCodeValid) {
      setIsJoinRoomLoading(true);
      setIsErr(true);
      setErr("Loading...");
      setStyles({ color: "green" });
      props.resetLoading({ left: "Load", right: "ing..." }, true);

      props.socket.emit(
        "joinRoom",
        { token: localStorage.getItem("token"), roomCode },
        (response) => {
          props.resetLoading({ left: null, right: null }, false);
          setIsJoinRoomLoading(false);
          if (!response.success) {
            setStyles({ color: "red" });

            setErr(response.errMessage);
            setIsErr(true);
          } else {
            props.changeOpponent(response.message.opponent);
            props.chooseSymbol("O");
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
                      {trimmer(props.name, 8)}
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
                      {trimmer(response.message.opponent, 8)}
                    </span>
                  </>
                ),
              },
              true
            );
            setTimeout(() => {
              props.game(true);
              props.resetLoading({ left: null, right: null }, false);
            }, 2000);
            setErr("Joined Room Successfully");
            setStyles({ color: "green" });
            setIsErr(true);
          }
        }
      );
    }
  };

  // Define the styles as JavaScript objects
  const joinButtonStyle = {
    boxShadow: roomCodeValid
      ? "-1px -1px 2px #00ff00, -1px 0 10px #00ff00, 1px 0 10px #00ff00, 0 1px 10px #00ff00"
      : "-1px -1px 2px #e60073, -1px 0 10px #e60073, 1px 0 10px #e60073, 0 1px 10px #e60073",

    marginBottom: "2.9rem",
  };

  return (
    <div className={styles.optionBox}>
      <div className={styles.name}>Hi, {trimmer(props.name, 10)}</div>
      {joinRoom ? (
        <input
          className={styles.input}
          placeholder="Enter room code"
          value={roomCode}
          onChange={changeRoomCode}
          style={{ marginBottom: isErr ? "0px" : "1rem" }}
        ></input>
      ) : null}
      {isErr && (
        <div className={styles.err} style={style}>
          {err}
        </div>
      )}
      <button
        disabled={isJoinRoomLoading}
        className={styles.options}
        style={joinButtonStyle} // Use the style object here
        onClick={joinRoomRequest}
      >
        {join}
      </button>
      {isRoomCodeRequested && (
        <>
          <div className={styles.friend}>Share this room code</div>
          <div className={styles.roomCodeSent}>
            {!isCreateErr ? (
              <div>{sentRoomCode}</div>
            ) : (
              <div style={{ color: "red" }}> {createErr}</div>
            )}
            <CopyButton textToCopy={sentRoomCode}></CopyButton>
          </div>
        </>
      )}
      <button
        disabled={isSentRoomLoading}
        className={styles.options}
        onClick={createRoom}
      >
        Create Room
      </button>
    </div>
  );
}

export default Option;
