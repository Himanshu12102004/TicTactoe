import React, { useEffect, useState } from "react";
import leftImg from "./leftImgR.png";
import rightImg from "./rightImgR.png";

import "./wating.css";
function Waiting(props) {
  const [openGates, setOpenGates] = useState(true);
  useEffect(() => {
    setOpenGates(props.open);
  });

  const innerWidth = `${window.innerWidth / 2}px`;
  return (
    <div>
      {/* <div
        onClick={() => {
          setOpenGates(!openGates);
        }}
        style={{ color: "white", position: "absolute", zIndex: 5000 }}
      >
        Btn
      </div> */}
      <div
        className={`leftImgContainer ${
          openGates ? "leftImgContainer--open" : "leftImgContainer--close"
        }`}
      >
        <img
          src={leftImg}
          className="leftImg img"
          style={{ width: innerWidth }}
        ></img>
        <div className="leftGateText text">{props.leftGateText}</div>
      </div>
      <div
        className={`rightImgContainer ${
          openGates ? "rightImgContainer--open" : "rightImgContainer--close"
        }`}
      >
        <img
          src={rightImg}
          className="rightImg img"
          style={{ width: innerWidth }}
        ></img>
        <div className="rightGateText text">{props.rightGateText}</div>
      </div>
    </div>
  );
}

export default Waiting;
