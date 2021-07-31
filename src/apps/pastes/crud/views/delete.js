const express = require("express");
const router = express.Router();
const pasteDatabase = require("../../models/paste");

router.delete("/", async (request, response) => {
	if (!request.body.id) {
		response.status(400).json({
			message: "`id` is missing.",
		});
		return;
	}
	paste = await pasteDatabase.getById(request.body.id);
	if (paste.length) {
		paste = paste[0];
		if (paste.user == request.user.id) {
			response.json({
				message: "Paste successfully deleted",
			});
			await pasteDatabase.deleteById(paste.id);
			return;
		}
		response.status(403).json({
			message: "Paste it isn't yours.",
		});
		return;
	}
	response.status(400).json({
		message: "Paste not found.",
	});
});

module.exports = router;
