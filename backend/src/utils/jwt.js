const jwt = require("jsonwebtoken");
const config = require("../config/env");
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "10h",
    },
  );
};

module.exports = {
  generateAccessToken,
};
