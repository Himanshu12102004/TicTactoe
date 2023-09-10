import React from "react";
import copy from "clipboard-copy";
import copyPhoto from "./copy.png";
import "./copy.css";
import share from "./share.png";
function CopyButton({ textToCopy }) {
  const handleCopyClick = () => {
    copy(textToCopy)
      .then(() => {
        alert("Text copied to clipboard");
      })
      .catch((error) => {
        console.error("Copy failed: ", error);
      });
  };
  const send = () => {
    const message = encodeURIComponent(
      `Play Tic-Tac-Toe with me only on https://tictactoe-himanshu.onrender.com/. Enter this room code ${textToCopy} `
    );
    const whatsappURL = `whatsapp://send?text=${message}`;

    window.location.href = whatsappURL;
  };
  return (
    <div className="copyAndShare">
      <div onClick={handleCopyClick}>
        <img
          src={copyPhoto}
          alt="Copy"
          style={{ height: "20px", marginTop: "2px" }}
        />
      </div>
      <div className="share">
        <img src={share} style={{ height: "22px" }} onClick={send}></img>
      </div>
    </div>
  );
}

export default CopyButton;
