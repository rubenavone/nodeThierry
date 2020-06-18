const express = require("express");
const router = express.Router();
const db = require("./../db/dbConf");

/* GET customers listing */
router.get("/", function (req, res, next) {
  db.query("SELECT * FROM customer", (err, result) => {
    console.log(err, result);
    if (err) {
      throw err;
    } else {
      res.send(result.rows);
    }
  });
});

module.exports = router;
