const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const all = require("./crud/all");
const get = require("./crud/get");
const languageRateLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 5,
	message: {
		error: "Too many language requests from this ip.",
	},
});
router.use(languageRateLimiter);
router.use("/all", all);
router.use("/get", get);

module.exports = router;
