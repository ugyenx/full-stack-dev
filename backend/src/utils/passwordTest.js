const bcrypt = require("bcrypt");
const passwordTest = async () => {
  const password = "ugyen123";
  const passwordHash = await bcrypt.hash(password, 10);
  console.log("hash: ", passwordHash);
  const correct = await bcrypt.compare("ugyen123", passwordHash);
  const incorrect = await bcrypt.compare("ugdfdsf", passwordHash);

  console.log("Correct password:", correct);
  console.log("Wrong password:", incorrect);
};

passwordTest();

src / controllers / authController.js;
src / services / authService.js;
src / repositories / authRepository.js;
src / routes / authRoute.js;
