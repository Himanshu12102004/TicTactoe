import React from "react";
import rightArrow from "./rightArrow.jpeg";
import styles from "./welcome.module.css";
import Canvas from "../canvas/Canvas";
function Welcome(props) {
  return (
    <div className={styles.welcomeBox}>
      {/* <Canvas
        canvasData={{
          width: 2,
          row: 2,
          column: null,
          diagonal: null,
          win: "row",
        }}
      ></Canvas> */}
      <div className={styles.welcomeText}>Welcome To Tic Tac Toe Neon</div>
      <div className={styles.himanshu}>By Himanshu</div>
      <div className={styles.imageContainer} onClick={props.welcomeButton}>
        <img src={rightArrow} className={styles.rightArrow}></img>
      </div>
    </div>
  );
}

export default Welcome;
