const nodemailer = require("nodemailer");
const { emailConfig } = require("../../config");
let transporter;
transporter = nodemailer.createTransport({
	...emailConfig,
});
function createEmail(mailOptions) {
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return reject(error);
			}
			resolve(info);
		});
	});
}

module.exports.createEmail = createEmail;
