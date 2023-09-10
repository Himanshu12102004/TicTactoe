const jwt = require("jsonwebtoken");
async function generateJWT(secret, payload) {
  try {
    const token = await new Promise((resolve, reject) => {
      jwt.sign(payload, secret, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
    return token;
  } catch (error) {
    throw error;
  }
}
module.exports = generateJWT;
