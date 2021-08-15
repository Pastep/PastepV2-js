const express = require("express");
const router = express.Router();

const reset = require("./views/reset");
const verify = require("./views/verify");
const rateLimit = require("express-rate-limit");
const passwordRateLimiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 5,
	message: {
		message: "Too many password requests from this ip.",
	},
});
router.use(passwordRateLimiter);
router.use("/reset", reset);
router.use("/verify", verify);

module.exports = router;
