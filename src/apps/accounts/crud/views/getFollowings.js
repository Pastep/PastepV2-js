const express = require("express");
const router = express.Router();
const followersDatabase = require("../../models/followers");
router.get("/", async (request, response) => {
	if (!request.query.user) {
		return response.json({
			message: "user is missing.",
		});
	}
	const result = await followersDatabase.createQuery(
		`SELECT users.id, users.username, users.persianUsername, users.avatar FROM followers INNER JOIN users ON followers.target=users.id WHERE followers.source=${request.query.user}`
	);
	return response.json(result);
});

module.exports = router;
