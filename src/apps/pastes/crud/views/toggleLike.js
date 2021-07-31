const express = require("express");
const router = express.Router();
const likeDatabase = require("../../models/like");
const pasteDatabase = require("../../models/paste");

router.post("/", async (request, response) => {
	if (!request.body.paste) {
		return response.status(400).json({
			message: "paste is missing",
		});
	}
	const paste = await pasteDatabase.getById(request.body.paste);
	if (paste.length) {
		let likes = await likeDatabase.all(request.user.id, request.body.paste);
		if (likes.length) {
			likes = likes[0];
			const result = await likeDatabase.deleteById(likes.id);
			return response.json({
				message: "successfully disliked paste.",
			});
		}
		const result = await likeDatabase.create(
			request.user.id,
			request.body.paste
		);
		return response.json({
			id: result.insertId,
			user: request.user.id,
			paste: request.body.paste,
		});
	}
	response.status(404).json({
		message: "paste not found.",
	});
});

module.exports = router;
