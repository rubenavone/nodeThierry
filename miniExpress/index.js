const miniExpress = require("./mini-express");
const fs = require("fs");
const app = miniExpress();

const favicon = (iconPath) => {
  return (request, response, next) => {
    if (
      request.method.toLowerCase() === "get" &&
      request.url === "/favicon.ico"
    ) {
      response.writeHead(200, { "content-type": "image/x-icon" });

      const iconReadable = fs.createReadStream(__dirname + "/favicon.ico");
      iconReadable.pipe(response);
    } else {
      next();
    }
  };
};

//const faviconMiddleware = favicon(__dirname + "favicon.ico");
//app.use(faviconMiddleware());
app.use(favicon(__dirname + "favicon.ico"));

// app.use((request, response, next) => {
//   if (
//     request.method.toLowerCase() === "get" &&
//     request.url === "/favicon.ico"
//   ) {
//     response.writeHead(200, { "content-type": "image/x-icon" });

//     const iconReadable = fs.createReadStream(__dirname + "/favicon.ico");
//     iconReadable.pipe(response);
//   } else {
//     next();
//   }
// });

// app.get("favicon.ico", (request, response) => {
//   if (
//     request.method.toLowerCase() === "get" &&
//     request.url === "/favicon.ico"
//   ) {
//     response.writeHead(200, { "content-type": "image/x-icon" });

//     const iconReadable = fs.createReadStream(__dirname + "/favicon.ico");
//     iconReadable.pipe(response);

//   } else {
//     next();
//   }
// });

app.use((request, response, next) => {
  console.log("Time:", Date.now());
  next();
});

app.get("/", (request, response) => {
  response.end("Hello World!");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
