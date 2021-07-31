const express = require("express");
const router = express.Router();
const commentDatabase = require("../../models/comment");

router.get("/", async (request, response) => {
	if (!request.query.paste) {
		return response.status(400).json({
			message: "paste id is missing.",
		});
	}
	let comments = Array.from(
		await commentDatabase.createQuery(
			`SELECT users.id as userId, comments.id as commentId, comments.content, users.username, users.persianUsername, users.avatar FROM comments INNER JOIN users on comments.user=users.id WHERE comments.paste = ${request.query.paste}`
		)
	);
	comments = comments.map((item) => {
		return {
			user: {
				id: item.userId,
				username: item.username,
				persianUsername: item.persianUsername,
				avatar: item.avatar,
			},
			comment: {
				id: item.commentId,
				content: item.content,
			},
		};
	});
	return response.json(comments);
});

module.exports = router;
