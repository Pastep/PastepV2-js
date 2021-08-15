let router = require("express").Router();
const { userWithVerification } = require("../../../../classes/api");
const { userSchemaValidate } = require("../../../../classes/schemas");
const userDatabase = require("../../models/user");
const { createEmail } = require("../../../../classes/email");
const { host } = require("../../../../../config");
const rateLimit = require("express-rate-limit");
const createAccountLimiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 5,
	message: {
		message: "Too many accounts created from this ip.",
	},
});
router.use(createAccountLimiter);
router.post("/", async (request, response) => {
	const { error } = userSchemaValidate(request.body);
	if (error) {
		response.status(400).send(error);
		return;
	}
	try {
		const result = await userDatabase.create(
			request.body.username,
			request.body.persianUsername,
			request.body.email,
			request.body.password
		);
		response.status(201).send({
			id: result.insertId,
		});
		let user = await userDatabase.getById(result.insertId);
		user = user[0];
		await createEmail({
			from: "noreply@pastep.com",
			to: request.body.email,
			subject: "Email verification",
			html: `<a href="https://${host}/accounts/email/verify/${user.verification_code}">Click Here!</a>`,
		});
		return;
	} catch (error) {
		if (error.errno == 1062) {
			response.status(300).json({
				message: error.message,
			});
			return;
		}
		throw new Error(error);
	}
});

module.exports = router;
