/**
 * Version thierry
 */
const http = require("http");
const { URL } = require("url");

const ResponseContent = require("./response-writter");
/**
 * Api pour récuperer
 */

const server = http.createServer((request, response) => {
  const reqUrl = new URL(request.url, `http://${request.headers.host}`);

  const responseWritter = new ResponseContent(response);

  if (request.url === "/") {
    responseWritter.index();
  } else if (request.url === "/hello") {
    responseWritter.hello();
  } else if (/^\/weather\?city=[0-9]{5}$/.test(request.url)) {
    console.log(reqUrl.searchParams);
    responseWritter.weather(reqUrl.searchParams.get("city"));
  } else if (request.url === "/montagne.jpg") {
    //responseWritter.getImageWithCallback();
    //responseWritter.getImageWithPromise();
    //responseWritter.getImageWithStream();
    responseWritter.getImageWithStreamGZ();
  } else {
    responseWritter.error(404, "404 page non trouvé");
  }
});
server.listen(8080);
