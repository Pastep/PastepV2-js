const express = require("express");
const router = express.Router();
const commentDatabase = require("../../models/comment");

router.delete("/", async (request, response) => {
	if (!request.body.id) {
		return response.status(400).json({
			message: "comment id is missing.",
		});
	}
	let comment = await commentDatabase.getById(request.body.id);
	if (comment.length) {
		comment = comment[0];
		if (comment.user == request.user.id) {
			try {
				const result = await commentDatabase.delete(request.body.id);
				return response.json({
					message: "comment successfully deleted.",
				});
			} catch (error) {
				throw new Error(error);
			}
		}
		return response.status(401).json({
			message: "comment isn't yours.",
		});
	}
	return response.status(404).json({
		message: "comment not found.",
	});
});

module.exports = router;
