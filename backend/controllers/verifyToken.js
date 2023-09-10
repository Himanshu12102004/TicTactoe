const userSchema = require("../models/userSchema");
const callBack = require("../utils/helpers/callBack");
const Response = require("../utils/helpers/respose");
const verifyJWT = require("../utils/security/verifyJwt");

const verifyToken = async (socket, data, cb) => {
  try {
    console.log("hcsjhs");
    const payload = await verifyJWT(process.env.USER_JWT_SECRET, data.token);
    console.log(payload);
    const user = await userSchema.findById(payload._id);
    if (user) {
      const response = new Response("success", true, { data: { user } }, null);
      callBack(response, cb);
    } else {
      throw new Error("No such user");
    }
  } catch (err) {
    const response = new Response("fail", false, null, err.message);
    callBack(response, cb);
  }
};
module.exports = verifyToken;
