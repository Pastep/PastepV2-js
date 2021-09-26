const config = true;
const port = 5000;
let host = "localhost";
const databaseConfig = {
	host: "192.168.1.50",
	port: 3306,
	username: "remote",
	password: "Kindertouch123",
	database: "pastep",
};
if (!config) {
	databaseConfig.username = "remote";
	databaseConfig.password = "Kindertouch123";
	databaseConfig.host = "localhost";
	host = "api.pastep.com";
}
const emailConfig = {
	service: "gmail",
	host: "smtp.gmail.com",
	auth: {
		user: "pastepsup@gmail.com",
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
