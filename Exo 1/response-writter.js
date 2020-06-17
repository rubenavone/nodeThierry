const https = require("https");
const fs = require("fs");
const zlib = require("zlib");

const date = new Date();

class ResponseContent {
  constructor(response) {
    this.response = response;
    this.contentType = response.writeHead(200, {
      "Content-Type": "text/html ; charset=utf-8",
    });
    this.actualDate = `nous sommes le ${date.getDate()} il est actuellement ${(
      "0" + date.getHours()
    ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`;
    this.generiqueBootstrap = `class=" text-light bg-secondary bg-secondary text-center p-3"`;
    this.generiqueMainCss = `style="font-size: 2em;"class="d-flex justify-content-lg-around"`;
  }

  htmlSuccess(bodyContent) {
    this.contentType;
    this.response.end(`<html><head>
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <title>MemoPlus version Bootstrap</title>
    </head>
    <body>${bodyContent} 
    </body>
    <footer class="fixed-bottom bg-secondary text-light">
    ${this.actualDate}
    </footer>
    </html>`);
  }
  /**
   * Traitement pour obtenir les images
   */
  getImageWithCallback = () => {
    //Version callback
    //__dirname correspond au dossier ou est lancée la function/méthode
    this.response.writeHead(200, {
      "content-type": "image/jpeg",
    });
    fs.readFile(__dirname + "/montagne.jpg", (err, content) => {
      if (err) {
        this.response.writeHead(400, { "Content-type": "text/html" });
        console.log(err);
        this.response.end("No such image");
      } else {
        //specify the content type in the response will be an image
        this.response.writeHead(200, { "Content-type": "image/jpg" });
        this.response.end(content);
        console.log(__dirname + "/montagne.jpg");
      }
    });
  };
  getImageWithPromise = () => {
    //Version Promesse
    this.response.writeHead(200, {
      "content-type": "image/jpeg",
    });
    fs.promises
      .readFile(__dirname + "/montagne.jpg")
      .then((data) => this.response.end(data))
      .catch(() => {
        this.response.end(`<p> Fichier non trouvé</p>`);
      });
  };
  getImageWithStream = () => {
    this.response.writeHead(200, {
      "content-type": "image/jpeg",
    });
    //Avec les stream
    fs.createReadStream(__dirname + "/montagne.jpg")
      .on("end", () => {
        console.log("lecture terminer");
      })
      .pipe(this.response);
  };
  getImageWithStreamGZ = () => {
    //Stream mai zipper
    this.response.writeHead(200, {
      "content-type": "image/jpeg",
      "content-encoding": "gzip",
    });
    fs.createReadStream(__dirname + "/montagne.jpg")
      .on("end", () => {
        console.log("lecture terminer");
      })
      //Compression de l'image, c'est une transformation du stream
      .pipe(zlib.createGzip())
      .pipe(this.response);
  };
  /***
   * END
   ***/

  index() {
    this.contentType;
    this.htmlSuccess(
      `
          <header ${this.generiqueBootstrap}>
            <h1>Bonjour Vous etes sur la page d'acceuil </h1>
          </header>
          <main ${this.generiqueMainCss} >
            <a href="/hello">hello </a>
            <a href="/weather?city=34172">weather </a>
          </main>     
       `
    );
  }

  hello() {
    this.contentType;
    this.htmlSuccess(
      `
            <header ${this.generiqueBootstrap}>
              <h1>Bonjour Vous etes sur la page Hello</h1>
            </header>
            <main ${this.generiqueMainCss}>
            <a href="/">Acceuil </a> 
            </main>
            
          `
    );
  }
  error(status, messageError) {
    this.response.writeHead(status, {
      "Content-Type": "text/html ; charset=utf-8",
    });
    this.htmlSuccess(
      `
            <header ${this.generiqueBootstrap}>
              <h1>Erreur ${messageError} page instrouvable</h1>
            </header>
            <main ${this.generiqueMainCss}>
            <a href="/">Acceuil </a> 
            </main>
            
          `
    );
  }

  weather = (city) => {
    const token =
      "08ddcc5675b44ea1f2c567010e544d25c47ca45a8392efc9ff693e471ebee936";
    const weatherApiUrl = `https://api.meteo-concept.com/api/forecast/daily?insee=${city}&token=${token}`;
    const headers = {
      Accept: "application/json",
    };
    /**
     * Fonction évènement qui traite l'information
     * @param  {String} weatherApiUrl
     * @param  {Object} {headers}
     */
    https.get(weatherApiUrl, { headers }, (apiResponse) => {
      let responseData = "";
      apiResponse.on("data", (chunk) => {
        //La concatenation fait un toString et transforme notre suite d'octet en String
        responseData += chunk;
        //console.log(responseData, "|||||");
        /**
         * Les chunk reçus sont exprimer en octet
         */
        //console.log(chunk, "|||||");
      });
      apiResponse.on("end", (chunk) => {
        const json = JSON.parse(responseData);
        if (json.code) {
          this.error(400, "400 Bad request");
        } else {
          this.contentType;
          /**
           * Récupere la totalité du tableau de temperature
           *  ${tableRows}
           */
          const tableRows = json.forecast
            .slice(0, 1)
            .map((f) => `<tr><td>${f.tmin}</td><td>${f.tmax}</td></tr>`)
            .join("");

          this.htmlSuccess(
            `
                <header ${this.generiqueBootstrap}>
                  <h1>Bonjour Vous etes sur la page Météo </h1>
                </header>
                <main ${this.generiqueMainCss}>
                <a href="/">Acceuil </a> 
                <p>Météo de ${json.city.name}, il fait actuellement ${json.forecast[0].tmin} ° celsius </p>
                <table>
                <img src="http://localhost:8080/montagne.jpg"/>
                <tr><th>t° min</th><th>T°max</th></tr>
                  <tr>
                  <!--<td>
                  ${json.forecast[0].tmin} ${json.forecast[1].tmax}
                  </td>-->
                  ${tableRows}
                  </tr>
                  <form>
                    <fieldset>
                      <legend>
                      choisir Une autre ville :
                      </legend>
                      <input type="text" name="city"/>
                      <button type="submit" class="btn btn-success"> valider </button>
                    </fieldset>
                  </form>
                </main>
              
             `
          );
        }

        console.log(json);
      });

      console.log(apiResponse);
    });
  };
}
module.exports = ResponseContent;
