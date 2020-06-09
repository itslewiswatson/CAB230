let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
const createHttpError = require("http-errors");

let db = require("./middleware/db");

let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");
let stocksRouter = require("./routes/stocks");

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(db);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/stocks", stocksRouter);

app.use((req, res, next) => {
  next(createHttpError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send();
});

module.exports = app;
