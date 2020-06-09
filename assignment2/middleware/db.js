const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "webcomputing",
});

connection.connect((err) => {
  if (err) throw err;
});

module.exports = (req, res, next) => {
  req.db = connection;
  next();
};
