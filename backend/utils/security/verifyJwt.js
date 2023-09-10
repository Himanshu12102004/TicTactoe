const jwt = require("jsonwebtoken");

function verifyJWT(secret, token) {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = jwt.verify(token, secret);
      resolve(payload);
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      reject(error);
    }
  });
}

module.exports = verifyJWT;
