const https = require("https");
const { join } = require("path");

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

  htmlError() {}
  index() {
    this.contentType;
    this.htmlSuccess(
      `
          <header ${this.generiqueBootstrap}>
            <h1>Bonjour Vous etes sur la page d'acceuil </h1>
          </header>
          <main ${this.generiqueMainCss} >
            <a href="/hello">hello </a>
            <a href="/weather">weather </a>
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

  weather = (city) => {
    const token =
      "08ddcc5675b44ea1f2c567010e544d25c47ca45a8392efc9ff693e471ebee936";
    const weatherApiUrl = `https://api.meteo-concept.com/api/forecast/daily?insee=${city}&token=${token}`;
    const headers = {
      Accept: "application/json",
    };
    https.get(weatherApiUrl, { headers, json: true }, (apiResponse) => {
      let responseData = "";
      apiResponse.on("data", (chunk) => {
        responseData += chunk;
      });

      apiResponse.on("end", (chunk) => {
        const json = JSON.parse(responseData);
        this.contentType;

        /**
         * Récupere la totalité du tableau de temperature
         *  ${tableRows}
         */
        // const tableRows = json.forecast
        //   .map((f) => `<tr><td>${f.tmin[0]}</td><td>${f.tmax[0]}</td></tr>`)
        //   .join("");

        this.htmlSuccess(
          `
                <header ${this.generiqueBootstrap}>
                  <h1>Bonjour Vous etes sur la page Météo </h1>
                </header>
                <main ${this.generiqueMainCss}>
                <a href="/">Acceuil </a> 
                <p>Météo de ${json.city.name}, il fait actuellement ${json.forecast[0].tmin} ° celsius </p>
                <table>
                <tr><th>t° min</th><th>T°max</th></tr>
                  <tr>
                  <td>
                  ${json.forecast[0].tmin} ${json.forecast[1].tmax}
                  </td>
                  </tr>
                </main>
              
             `
        );
        console.log(json);
      });

      console.log(apiResponse);
    });
  };
}
module.exports = ResponseContent;
