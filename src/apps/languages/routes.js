const express = require("express");
const router = express.Router();

const all = require("./crud/all");
const get = require("./crud/get");
router.use("/all", all);
router.use("/get", get);

module.exports = router;