const knex = require("knex")(require("../db.config"));

module.exports = (req, res, next) => {
  req.knex = knex;
  next();
};
