const express = require("express");
const router = express.Router();
const markdown = require("markdown").markdown;

const userDatabase = require("../../models/user");
const { getSchemaValidate } = require("../../../../classes/schemas");

router.get("/", async (request, response) => {
	const { error } = getSchemaValidate(request.query);
	if (error) {
		response.status(400).send(error);
		return;
	}
	let user;
	if (request.query.username) {
		user = await userDatabase.getByUsername(request.query.username);
	} else if (request.query.id) {
		user = await userDatabase.getById(request.query.id);
	} else if (request.query.email) {
		user = await userDatabase.getByEmail(request.query.email);
	} else if (request.query.token) {
		user = await userDatabase.getByToken(request.query.token);
		if (user.length) {
			user = user[0];
			return response.json({
				id: user.id,
				username: user.username,
				persianUsername: user.persianUsername,
				email: user.email,
				bio: user.bio,
				avatar: user.avatar,
			});
		}
		return response.status(404).json({
			message: "User not found.",
		});
	} else {
		response.status(400).json({
			message: "Username or email or id or token is required",
		});
		return;
	}
	if (user.length) {
		user = user[0];
		response.json({
			id: user.id,
			username: user.username,
			persianUsername: user.persianUsername,
			bio: user.bio,
			avatar: user.avatar,
		});
		return;
	}
	response.status(404).json({
		message: "User not found.",
	});
});

module.exports = router;
