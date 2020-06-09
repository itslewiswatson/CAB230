const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.post("/login", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send({
      error: true,
      message: "Request body invalid - email and password are required",
    });
    return;
  }

  req.db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }

      if (result.length === 0) {
        res
          .status(401)
          .send({ error: true, message: "Incorrect email or password" });
        return;
      }

      const user = result[0];
      const match = bcrypt.compare(password, user.hash);

      if (!match) {
        res
          .status(401)
          .send({ error: true, message: "Incorrect email or password" });
        return;
      }

      const secretKey = auth.SECRET_TOKEN_KEY;
      const expiresIn = 60 * 60 * 24;
      const exp = Date.now() + expiresIn * 1000;
      const token = jwt.sign({ email, exp }, secretKey);
      res.json({ token_type: "Bearer", token, expires_in: expiresIn });
    }
  );
});

router.post("/register", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body invalid - email and password are required",
    });
    return;
  }

  req.db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }

      if (result.length > 0) {
        res.status(409).json({ error: true, message: "User already exists!" });
        return;
      }

      const saltRounds = 10;
      const hash = bcrypt.hashSync(password, saltRounds);

      req.db.query(
        "INSERT INTO users (email, hash) VALUES (?, ?)",
        [email, hash],
        (err) => {
          if (err) {
            next(err);
            return;
          }

          res.json({ success: true, message: "User created" });
        }
      );
    }
  );
});

module.exports = router;
