import React from "react";
import "./container.css";
import fight from "./ticTakToe.jpeg";

function Form(props) {
  return (
    <div className="formAndWelcome">
      <div className="imgContainer">
        <img alt="img" className="ticTacToeImage" src={fight}></img>
      </div>
      {props.children}
    </div>
  );
}

export default Form;
