const config = false;
const port = 5000;
let host = "localhost";
const databaseConfig = {
	host: "localhost",
	port: 3306,
	username: "remote",
	password: "Kindertouch123",
	database: "pastep",
};
if (!config) {
	databaseConfig.username = "remote";
	databaseConfig.password = "Kindertouch123";
	databaseConfig.host = "194.5.195.199";
	host = "api.pastep.com";
}
const emailConfig = {
	host: "mail.pastep.com",
	port: 465,
	secure: true,
	auth: {
		user: "noreply@pastep.com",
		pass: "Kindertouch123",
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
