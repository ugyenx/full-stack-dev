const { generateAccessToken } = require("./jwt");

const user = {
  id: 1,
  name: "ugyen",
  email: "udeeadnres2020@gmail.com",
};

const token = generateAccessToken(user);
console.log(token);
