const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");

// Serve swagger at root level
router.get("/", swaggerUi.setup(yaml.load("./public/swagger.yaml")));

module.exports = router;
