const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const httpError = require("../util/httpError");

router.get(
  "/symbols",
  /**
   * Ensure any other parameters are not specified
   * Let the caller know that only industry is allowed
   */
  (req, res, next) => {
    for (let param in req.query) {
      if (param !== "industry") {
        throw httpError(
          400,
          "Invalid query parameter: only 'industry' is permitted"
        );
      }
    }
    next();
  },
  (req, res, next) => {
    const industry = req.query.industry;

    /**
     * Conditionally construct query
     */
    const query = req.knex.select("name", "symbol", "industry").from("stocks");
    if (industry) {
      query.where("industry", "like", `%${industry}%`);
    }
    query.groupBy("symbol", "name", "industry");

    /**
     * Execute query
     */
    query
      .then((result) => {
        // Display that industry isn't found if specified
        if (result.length === 0 && industry) {
          throw httpError(404, "Industry sector not found");
        }
        res.json(result);
      })
      .catch((err) => next(err));
  }
);

router.get(
  "/:symbol",
  /**
   * Ensure symbol is provided and formatted correctly
   */
  (req, res, next) => {
    const symbol = req.params.symbol;
    if (
      !symbol ||
      symbol.toUpperCase() !== symbol ||
      symbol.length < 1 ||
      symbol.length > 5
    ) {
      throw httpError(
        400,
        "Stock symbol incorrect format - must be 1-5 capital letters"
      );
    } else {
      next();
    }
  },
  /**
   * Ensure any date and from parameters are not present
   * Let the caller know that they are for the authed route only
   */
  (req, res, next) => {
    if (req.query && (req.query.to || req.query.from)) {
      throw httpError(
        400,
        "Date parameters only available on authenticated route /stocks/authed"
      );
    } else {
      next();
    }
  },
  /**
   * Perform lookup and return data
   */
  (req, res, next) => {
    const symbol = req.params.symbol;

    const query = req.knex
      .select("*")
      .from("stocks")
      .where("symbol", symbol)
      .limit(1);

    query
      .then((result) => {
        if (result.length < 1) {
          throw httpError(
            404,
            "No entry for symbol in stocks symbol in database"
          );
        }

        res.json(result[0]);
      })
      .catch((err) => next(err));
  }
);

router.get(
  "/authed/:symbol",
  auth.authorize, // Route must be authorized
  /**
   * Ensure only to and from query parameters are allowed
   */
  (req, res, next) => {
    for (let param in req.query) {
      if (param !== "to" && param !== "from") {
        throw httpError(
          400,
          "Parameters allowed are 'from' and 'to', example: /stocks/authed/AAL?from=2020-03-15"
        );
      }
    }
    next();
  },
  /**
   * Ensure that 'to' and 'from' if they exist are actual dates
   */
  (req, res, next) => {
    if (
      (req.query.to && !Date.parse(req.query.to)) ||
      (req.query.from && !Date.parse(req.query.from))
    ) {
      throw httpError(
        400,
        "Parameters allowed are 'from' and 'to', example: /stocks/authed/AAL?from=2020-03-15"
      );
    }
    next();
  },
  /**
   * Perform query for data and send response
   */
  (req, res, next) => {
    let query = req.knex
      .select("*")
      .from("stocks")
      .where("symbol", req.params.symbol);

    /**
     * Handle all cases of to and from
     */
    if (req.query.to && req.query.from) {
      query.andWhereBetween("timestamp", [req.query.from, req.query.to]);
    } else if (req.query.to && !req.query.from) {
      query.andWhere("timestamp", "<=", req.query.to);
    } else if (!req.query.to && req.query.from) {
      query.andWhere("timestamp", ">=", req.query.from);
    } else {
      query.limit(1);
    }

    query
      .then((result) => {
        // Provide 404 error
        if (result.length === 0) {
          throw httpError(
            404,
            "No entries available for query symbol for supplied date range"
          );
        }

        // Repackage single result
        if (result.length === 1) {
          res.json(result[0]);
          return;
        }

        // Return full array
        res.json(result);
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
