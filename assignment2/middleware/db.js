const knex = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "webcomputing",
  },
});

module.exports = (req, res, next) => {
  req.knex = knex;
  next();
};
