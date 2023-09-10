const user = require("../models/userSchema");
const callBack = require("../utils/helpers/callBack");
const Response = require("../utils/helpers/respose");
const generateJWT = require("../utils/security/generateJwt");
const signUp = async (socket, data, cb) => {
  try {
    const myUser = await user.create({ name: data.name });
    const token = await generateJWT(process.env.USER_JWT_SECRET, {
      _id: myUser._id,
    });
    const response = new Response(
      "success",
      true,
      { data: { name: data.name, token } },
      null
    );
    callBack(response, cb);
  } catch (err) {
    const response = new Response("fail", false, null, err.message);
    callBack(response, cb);
  }
};
module.exports = signUp;
