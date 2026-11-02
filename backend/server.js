const app = require("./app");
const config = require("./src/config/env");

app.listen(config.PORT, config.HOST, () => {
  console.log(`Server running at http://${config.HOST}:${config.PORT}`);
});
