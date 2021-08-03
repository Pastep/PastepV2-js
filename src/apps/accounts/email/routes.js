const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const verify = require("./views/verify");
const resend = require("./views/resend");

const emailRateLimiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 5,
	message: {
		error: "Too many email requests from this ip.",
	},
});
router.use(emailRateLimiter);
router.use("/verify", verify);
router.use("/resend", resend);

module.exports = router;
