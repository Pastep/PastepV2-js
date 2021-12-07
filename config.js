const config = true;
const port = 5000;
let host = "localhost";
const databaseConfig = {
	host: "127.0.0.1",
	port: 3306,
	username: "root",
	password: "",
	database: "pastep",
};
if (!config) {
	databaseConfig.username = "remote";
	databaseConfig.password = "hahhahhaha";
	databaseConfig.host = "localhost";
	host = "api.pastep.com";
}
const emailConfig = {
	service: "gmail",
	host: "smtp.gmail.com",
	auth: {
		user: "yourmom@gmail.com",
		pass: "your mama big",
	},
};

const modes = {
	public: 0,
	private: 1,
	passwordProtected: 2,
};

module.exports.host = host;
module.exports.port = port;
module.exports.databaseConfig = databaseConfig;
module.exports.emailConfig = emailConfig;
module.exports.modes = modes;
module.exports.config = config;
