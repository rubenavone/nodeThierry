const http = require("http");

class MiniExpress {
  constructor() {
    this.middlewares = [];
  }

  use = (middleware) => {
    this.middlewares.push(middleware);
  };

  route = (method, path, callback) => {
    this.use((request, response, next) => {
      if (this.method === method && request.url === path) {
        callback(request, response);
      } else {
        next();
      }
    });
  };

  get = (path, callback) => {
    this.route("get", callback);
  };

  listen = (port, callback) => {
    http.createServer = (request,
    (response) => {
      console.log("Le serveur est démaré sur le port", port);
    }).listen(port);
  };
}

function createMiniExpress() {
  return new MiniExpress();
}

module.exports = createMiniExpress;
