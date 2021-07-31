const express = require("express");
const router = express.Router();
const pasteDatabase = require("../../models/paste");
const commentDatabase = require("../../models/comment");

router.post("/", async (request, response) => {
	if (!request.body.paste || !request.body.content) {
		return response.status(400).json({
			message: "paste or content is missing.",
		});
	}
	const paste = await pasteDatabase.getById(request.body.paste);
	if (paste.length) {
		try {
			const result = await commentDatabase.create(
				request.user.id,
				request.body.paste,
				request.body.content
			);
			if (result.insertId) {
				return response.json({
					id: result.insertId,
					message: "comment successfully created.",
				});
			}
		} catch (error) {
			throw new Error(error);
		}
	}
	return response.status(404).json({
		message: "paste not found.",
	});
});

module.exports = router;
