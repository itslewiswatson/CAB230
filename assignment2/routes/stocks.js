const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get(
  "/symbols",
  (req, res, next) => {
    for (let param in req.query) {
      if (param !== "industry") {
        res.status(400).send({
          error: true,
          message: "Invalid query parameter: only 'industry' is permitted",
        });
        return;
      }
    }
    next();
  },
  (req, res) => {
    const industry = req.query["industry"];

    let query = industry
      ? "SELECT name, symbol, industry FROM stocks WHERE industry LIKE ? GROUP BY symbol, name, industry"
      : "SELECT name, symbol, industry FROM stocks GROUP BY symbol, name, industry";

    req.db.query(query, [`%${industry}%`], (err, result) => {
      if (err) throw err;

      if (result.length === 0) {
        res
          .status(400)
          .send({ error: true, message: "Industry sector not found" });
        return;
      }

      res.send(result);
    });
  }
);

router.get(
  "/:symbol",
  (req, res, next) => {
    const symbol = req.params["symbol"];
    if (
      !symbol ||
      symbol.toUpperCase() !== symbol ||
      symbol.length < 1 ||
      symbol.length > 5
    ) {
      res.status(400).send({
        error: true,
        message: "Stock symbol incorrect format - must be 1-5 capital letters",
      });
    } else {
      next();
    }
  },
  (req, res, next) => {
    if (req.query && (req.query.to || req.query.from)) {
      res.status(400).send({
        error: true,
        message:
          "Date parameters only available on authenticated route /stocks/authed",
      });
    } else {
      next();
    }
  },
  (req, res) => {
    const symbol = req.params["symbol"];
    const query =
      "SELECT timestamp, symbol, name, industry, open, high, low, close, volumes FROM stocks WHERE symbol = ? LIMIT 1";

    req.db.query(query, [symbol], (err, result) => {
      if (err) throw err;
      if (result.length < 1) {
        res.send({
          error: true,
          message: "No entry for symbol in stocks symbol in database",
        });
        return;
      }

      res.send(result[0]);
    });
  }
);

router.get(
  "/authed/:symbol",
  auth,
  (req, res, next) => {
    for (let param in req.query) {
      if (param !== "to" && param !== "from") {
        res.status(400).send({
          error: true,
          message:
            "Parameters allowed are 'from' and 'to', example: /stocks/authed/AAL?from=2020-03-15",
        });
        return;
      }
    }
    next();
  },
  (req, res, next) => {
    if (
      (req.query.to && !Date.parse(req.query.to)) ||
      (req.query.from && !Date.parse(req.query.from))
    ) {
      res.status(400).send({
        error: true,
        message:
          "Parameters allowed are 'from' and 'to', example: /stocks/authed/AAL?from=2020-03-15",
      });
      return;
    }
    next();
  },
  (req, res) => {
    let query =
      "SELECT timestamp, symbol, name, industry, open, high, low, close, volumes FROM stocks WHERE symbol = ?";

    let args = [req.params["symbol"]];

    if (req.query.to && req.query.from) {
      query += " AND timestamp BETWEEN ? AND ?";
      args.push(req.query.from);
      args.push(req.query.to);
    } else if (req.query.to && !req.query.from) {
      query += " AND timestamp <= ?";
      args.push(req.query.to);
    } else if (!req.query.to && req.query.from) {
      query += " AND timestamp >= ?";
      args.push(req.query.from);
    } else {
      query += " LIMIT 1";
    }

    req.db.query(query, args, (err, result) => {
      if (err) throw err;

      if (result.length === 0) {
        res.status(404).send({
          error: true,
          message:
            "No entries available for query symbol for supplied date range",
        });
        return;
      }

      if (result.length === 1) {
        res.send(result[0]);
        return;
      }

      res.send(result);
    });
  }
);

module.exports = router;
