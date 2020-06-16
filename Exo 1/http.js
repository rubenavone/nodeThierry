/**
 * Version thierry
 */
const http = require("http");
const fs = require("fs");
const ResponseContent = require("./response-writter");
/**
 * Api pour récuperer
 */

const server = http.createServer((request, response) => {
  const responseWritter = new ResponseContent(response);
  if (request.url === "/") {
    responseWritter.index();
  } else if (request.url === "/hello") {
    responseWritter.hello();
  } else if (request.url === "/weather") {
    responseWritter.weather(34172);
  }
});
server.listen(8080);
