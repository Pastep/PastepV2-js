const express = require("express");
const router = express.Router();

const verify = require("./views/verify");
const resend = require("./views/resend");

router.use("/verify", verify);
router.use("/resend", resend);

module.exports = router;