const userSchema = require("../../models/userSchema");
const verifyJWT = require("../security/verifyJwt");

const checkLogin = (socket, secret, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = await verifyJWT(secret, token);
      const user = await userSchema.findById(payload._id);
      if (user) {
        socket.user = user;
        resolve(user); // Resolve with the user object if successful
      } else {
        reject(new Error("logInFirst")); // Reject with an error if user not found
      }
    } catch (err) {
      console.error(err);
      reject(err); // Reject with the caught error
    }
  });
};

module.exports = checkLogin;
