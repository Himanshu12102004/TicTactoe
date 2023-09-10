const gameWin = (game) => {
  const rowCheck = (row) => {
    if (game[row][0] === game[row][1] && game[row][1] === game[row][2]) {
      if (game[row][0] === "X") {
        return { status: true, player: "playerOne" };
      } else if (game[row][0] === "O")
        return { status: true, player: "playerTwo" };
    }
    return { status: false, player: null };
  };
  const columnCheck = (column) => {
    if (
      game[0][column] === game[1][column] &&
      game[1][column] === game[2][column]
    ) {
      if (game[0][column] === "X") {
        return { status: true, player: "playerOne" };
      } else if (game[0][column] === "O")
        return { status: true, player: "playerTwo" };
    }
    return { status: false, player: null };
  };
  const leftDiagonalCheck = () => {
    if (game[0][0] === game[1][1] && game[1][1] === game[2][2]) {
      if (game[0][0] === "X") {
        return { status: true, player: "playerOne" };
      } else if (game[0][0] === "O")
        return { status: true, player: "playerTwo" };
    }
    return { status: false, player: null };
  };
  const rightDiagonalCheck = () => {
    if (game[0][2] === game[1][1] && game[1][1] === game[2][0]) {
      if (game[2][0] === "X") {
        return { status: true, player: "playerOne" };
      } else if (game[2][0] === "O")
        return { status: true, player: "playerTwo" };
    }
    return { status: false, player: null };
  };
  let k = 0;
  for (let i = 0; i < 3; i++) {
    const row = rowCheck(i);
    if (row.status) return row;
    const column = columnCheck(i);
    if (column.status) return column;
    const leftDiagonal = leftDiagonalCheck(i);
    if (leftDiagonal.status) return leftDiagonal;
    const rightDiagonal = rightDiagonalCheck(i);
    if (rightDiagonal.status) return rightDiagonal;
    for (let j = 0; j < 3; j++) {
      if (game[i][j] != "") k++;
      else break;
    }
  }
  if (k === 9) {
    return { status: true, player: "tied" };
  } else return { status: false, player: null };
};
module.exports = gameWin;
