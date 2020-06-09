const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const createHttpError = require("http-errors");

const db = require("./middleware/db");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const stocksRouter = require("./routes/stocks");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(db);

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/stocks", stocksRouter);

app.use((req, res, next) => {
  next(createHttpError(404));
});

app.use((err, req, res, next) => {
  const error = req.app.get("env") === "development" ? err : true;

  res.status(err.status || 500);
  res.json({ error, message: err.message });
});

module.exports = app;
