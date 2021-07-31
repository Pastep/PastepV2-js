const chalk = require("chalk");
const express = require("express");
var cors = require("cors");
const app = express();
const { host, port } = require("./config");
const languages = require("./src/apps/languages/routes");
const accounts = require("./src/apps/accounts/routes");
const pastes = require("./src/apps/pastes/routes");

const { serverError } = require("./src/classes/errors");
app.use("*", cors());
app.use((request, res, next) => {
	console.log(`${request.method}:${request.url}`);
	// res.setHeader("Access-Control-Allow-Origin", "*");
	// res.setHeader("Access-Control-Allow-Methods", "*");
	// res.setHeader(
	// 	"Access-Control-Allow-Headers",
	// 	"X-Requested-With,Content-Type,Authorization"
	// );
	// res.setHeader("Access-Control-Allow-Credentials", true);
	next();
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
