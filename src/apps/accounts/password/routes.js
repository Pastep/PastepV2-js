const express = require("express");
const router = express.Router();

const reset = require("./views/reset");
const verify = require("./views/verify");

router.use("/reset", reset);
router.use("/verify", verify);

module.exports = router;