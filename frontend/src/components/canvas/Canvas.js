import React, { useEffect, useRef } from "react";
import "./canvas.css";

function Canvas(props) {
  const canvasRef = useRef(null);
  // color,row,column,diagonal,win
  useEffect(() => {
    const canvas = canvasRef.current;
    const pen = canvas.getContext("2d");

    canvas.height = 200;
    canvas.width = 200;
    let obj;
    if (props.canvasData.win === "row") {
      obj = new Line(
        3,
        { x: 0, y: 40 + 60 * props.canvasData.row },
        "row",
        props.canvasData.color,
        pen
      );
    } else if (props.canvasData.win === "column") {
      obj = new Line(
        3,
        { x: 40 + 60 * props.canvasData.column, y: 0 },
        "column",
        props.canvasData.color,
        pen
      );
    } else if (props.canvasData.win === "d1") {
      obj = new Line(3, { x: 0, y: 0 }, "d1", props.canvasData.color, pen);
    } else if (props.canvasData.win === "d2") {
      obj = new Line(3, { x: 200, y: 0 }, "d2", props.canvasData.color, pen);
    }

    obj.init();
    const animate = () => {
      const animation = requestAnimationFrame(animate);
      obj.update();
      if (obj.end.x > canvas.width || obj.end.y > canvas.height) {
        props.winLoseGates({
          left: "You",
          right: props.canvasData.hasWon ? "Win" : "Lose",
        });
        cancelAnimationFrame(animation);
      }
    };
    animate();
  }, []);

  class Line {
    constructor(width, start, whereWin, color, ctx) {
      this.width = width;
      this.start = start;
      this.whereWin = whereWin;
      this.end = { x: null, y: null };
      this.ctx = ctx;
      this.color = color;
    }
    init() {
      this.ctx.beginPath();
      this.ctx.lineWidth = this.width;
      this.ctx.moveTo(this.start.x, this.start.y);
      this.end = { ...this.start };
      this.ctx.strokeStyle = props.canvasData.hasWon
        ? "rgb(24, 194, 24)"
        : "rgb(230, 29, 29)";
    }
    draw() {
      this.ctx.lineTo(this.end.x, this.end.y);
      this.ctx.stroke();
    }
    update() {
      if (this.whereWin === "row") {
        this.end.x += 5;
      }
      if (this.whereWin === "column") {
        this.end.y += 5;
      }
      if (this.whereWin === "d1") {
        this.end.x += 5;
        this.end.y += 5;
      }
      if (this.whereWin === "d2") {
        this.end.x -= 5;
        this.end.y += 5;
      }
      this.draw();
    }
  }

  return <canvas ref={canvasRef}></canvas>;
}

export default Canvas;
