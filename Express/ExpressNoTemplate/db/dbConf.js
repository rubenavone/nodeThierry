const { Pool } = require("pg");

const db = new Pool({
  hostname: "localhost",
  port: 5432,
  user: "Express",
  password: "azerty",
  database: "ExpressCustomer",
});

module.exports = db;
