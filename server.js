const chalk = require("chalk");
const https = require("https");
const express = require("express");
const app = express();
const { host, port } = require("./config");
const accounts = require("./src/apps/accounts/routes");
const pastes = require("./src/apps/pastes/routes");
const { serverError } = require("./src/classes/errors");
app.use(express.json());
app.use((request, response, next) => {
    console.log(`${request.method}:${request.url}`);
    response.setHeader( 'X-Powered-By', 'Pastep.Js' );
    next();
});
app.use("/accounts", accounts);
app.use("/pastes", pastes);
app.use(function(err, req, res, next) {
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