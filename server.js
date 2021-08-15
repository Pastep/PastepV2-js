const chalk = require("chalk");
const express = require("express");
var cors = require("cors");
const app = express();
const rateLimit = require("express-rate-limit");
const { host, port } = require("./config");
const languages = require("./src/apps/languages/routes");
const accounts = require("./src/apps/accounts/routes");
const pastes = require("./src/apps/pastes/routes");
var fs = require("fs");
var util = require("util");
var log_file = fs.createWriteStream(__dirname + "/log.log", { flags: "w" });
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 200,
	statusCode: 429,
	message: {
		message: "You're rate limited.",
	},
});
const { serverError } = require("./src/classes/errors");
app.set("trust proxy", true);
app.use("*", cors());
app.use(limiter);
app.use((request, res, next) => {
	const logString = `${request.method}:${request.url} ${request.ip}`;
	next();
	log_file.write(util.format(logString) + "\n");
	console.log(logString);
});
app.use("/avatars", express.static("./public/avatars"));
app.use(express.json({ limit: "50mb" }));
app.use("/languages", languages);
app.use("/accounts", accounts);
app.use("/pastes", pastes);
app.use(function (err, req, res, next) {
	res.status(500).json({
		message: "Server occurred an error!, Error has been sent to developers...",
	});
	serverError(err);
});
app.listen(port, () => {
	console.log(
		chalk.greenBright(
			`server is online at ${chalk.blueBright(`${host}:${port}`)}`
		)
	);
});
