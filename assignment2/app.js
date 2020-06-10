const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const createHttpError = require("http-errors");
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

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
app.use(logger("common"));
app.use(helmet());
app.use(cors());
app.use(db);

app.use("/", swaggerUi.serve, indexRouter);
app.use("/user", usersRouter);
app.use("/stocks", stocksRouter);

app.use((req, res, next) => {
  next(createHttpError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: true, message: err.message });
});

module.exports = app;
