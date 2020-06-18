const http = require("http");

class MiniExpress {
  constructor() {
    this.middlewares = [];
  }

  listen(port, callback) {
    const server = http.createServer((request, response) => {
      this.useMiddleware(0, request, response);
    });
    server.listen(port, callback);
  }

  useMiddleware(index, request, response) {
    const next = () => {
      this.useMiddleware(index + 1, request, response);
    };
    const middleware = this.middlewares[index];
    if (middleware) {
      middleware(request, response, next);
    }
  }

  route(method, path, callback) {
    this.use((request, response, next) => {
      if (request.method.toLowerCase() === method && request.url === path) {
        callback(request, response);
      } else {
        next();
      }
    });
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  get(path, callback) {
    this.route("get", path, callback);
  }
}

function createMiniExpress() {
  return new MiniExpress();
}

module.exports = createMiniExpress;
