const leftRight = (str) => {
  return {
    left: str.substring(0, str.length / 2),
    right: str.substring(str.length / 2),
  };
};
module.exports = leftRight;
