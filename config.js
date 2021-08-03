const config = true;
const port = 5000;
let host = "localhost";
const databaseConfig = {
	host: "localhost",
	port: 3306,
	username: "root",
	password: "",
	database: "pastep",
};
if (!config) {
	databaseConfig.username = "pastepco_root";
	databaseConfig.password = "Kindertouch123";
	databaseConfig.database = "pastepco_pastepv2";
	host = "api.pastep.com";
}
const emailConfig = {
	host: "amsterdam-02.bpanel.xyz",
	port: 465,
	secure: true,
	auth: {
		user: "noreply@pastep.com",
		pass: "8gm.27j^!aO-",
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
