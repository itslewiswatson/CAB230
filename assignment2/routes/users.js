const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const httpError = require("../util/httpError");

router.post("/login", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  /**
   * Ensure both email and password are present
   */
  if (!email || !password) {
    throw httpError(
      400,
      "Request body invalid - email and password are required"
    );
  }

  const query = req.knex.select("*").from("users").where("email", "=", email);

  query
    .then((result) => {
      // No account exists for email
      if (result.length === 0) {
        throw httpError(401, "Incorrect email or password");
      } else {
        // Determine if password on record is the same as given password
        const user = result[0];
        return bcrypt.compareSync(password, user.hash);
      }
    })
    .then((match) => {
      // They do not match, cancel request
      if (!match) {
        throw httpError(401, "Incorrect email or password");
      }

      // They do match, generate new token
      const secretKey = auth.SECRET_TOKEN_KEY;
      const expiresIn = 60 * 60 * 24; // 24 hours
      const exp = Date.now() + expiresIn * 1000;
      const token = jwt.sign({ email, exp }, secretKey);
      res.json({ token, token_type: "Bearer", expires_in: expiresIn });
    })
    .catch((err) => next(err));
});

router.post("/register", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  /**
   * Ensure both email and password are present
   */ if (!email || !password) {
    throw httpError(
      400,
      "Request body invalid - email and password are required"
    );
  }

  const query = req.knex.select("*").from("users").where("email", "=", email);

  query.then((result) => {
    // User already exists
    if (result.length > 0) {
      throw httpError(409, "User already exists!");
    }

    // Hash given password with bcrypt to store securely
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    const insert = req.knex("users").insert({ email, hash });

    insert
      .then(() => {
        res.status(201).json({ success: true, message: "User created" });
      })
      .catch((err) => next(err));
  });
});

module.exports = router;
