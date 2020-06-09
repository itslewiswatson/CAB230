const SECRET_TOKEN_KEY = "scotty_and_the_ninjas";

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const unparsedToken = req.headers["authorization"];
  let token = null;

  if (unparsedToken && unparsedToken.split(" ").length === 2) {
    token = unparsedToken.split(" ")[1];
  } else {
    res
      .status(401)
      .json({ error: true, message: "Authorization header not found" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_TOKEN_KEY);

    if (decoded.exp < Date.now()) {
      res.status(403).json({ error: true, message: "token expired" });
    }

    next();
  } catch (e) {
    res.status(403).json({ error: true, message: e.message });
  }
};
