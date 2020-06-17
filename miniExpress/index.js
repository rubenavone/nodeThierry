const miniExpress = require("./mini-express");

const app = miniExpress();

app.use(function (request, response, next) {
  console.log("Time:", Date.now());
  next();
});

app.get("/", function (request, response) {
  response.send("Hello World!");
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
