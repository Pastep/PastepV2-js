const express = require("express");
const router = express.Router();

const crud = require("./crud/routes");
router.use("/", crud);

module.exports = router;