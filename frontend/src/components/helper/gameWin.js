const gameWin = (game, symbol) => {
  const rowCheck = (row) => {
    if (game[row][0] === game[row][1] && game[row][1] === game[row][2]) {
      if (game[row][0] === symbol) {
        return {
          status: true,
          tied: false,
          wonIn: "row",
          row: row,
          column: null,
        };
      }
    }
    return { status: false, tied: false };
  };
  const columnCheck = (column) => {
    if (
      game[0][column] === game[1][column] &&
      game[1][column] === game[2][column]
    ) {
      if (game[0][column] === symbol) {
        return {
          status: true,
          tied: false,
          wonIn: "column",
          row: null,
          column: column,
        };
      }
    }
    return { status: false, tied: false };
  };
  const leftDiagonalCheck = () => {
    if (game[0][0] === game[1][1] && game[1][1] === game[2][2]) {
      if (game[0][0] === symbol) {
        return {
          status: true,
          tied: false,
          wonIn: "d1",
          row: null,
          column: null,
        };
      }
    }
    return { status: false, tied: false };
  };
  const rightDiagonalCheck = () => {
    if (game[0][2] === game[1][1] && game[1][1] === game[2][0]) {
      if (game[2][0] === symbol) {
        return {
          status: true,
          tied: false,
          wonIn: "d2",
          row: null,
          column: null,
        };
      }
    }
    return { status: false, tied: false };
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
    return { status: false, tied: true };
  } else return { status: false, tied: false };
};
module.exports = gameWin;
