const express = require("express");
const router = express.Router();
const { userWithVerification } = require("../../../../classes/api");
const followersDatabase = require("../../models/followers");
const userDatabase = require("../../models/user");
router.use(userWithVerification);
router.post("/", async (request, response) => {
	if (!request.body.target) {
		return response.status(400).json({
			message: "target is missing.",
		});
	}
	let user = await userDatabase.getById(request.body.target);
	if (user.length) {
		user = user[0];
		if (user.id == request.user.id) {
			return response.status(401).json({
				message: "following yourself?",
			});
		}
		let result = await followersDatabase.get(request.user.id, user.id);
		if (result.length) {
			result = result[0];
			result = await followersDatabase.deleteById(result.id);
			return response.json({
				message: "user successfully un followed",
			});
		}
		result = await followersDatabase.create(request.user.id, user.id);
		return response.json({
			id: result.insertId,
		});
	}
	return response.status(404).json({ message: "Source user not found." });
});

module.exports = router;
