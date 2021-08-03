const express = require("express");
const router = express.Router();
const { pasteSchemaValidate } = require("../../../../classes/schemas");
const pasteDatabase = require("../../models/paste");
const languageDatabase = require("../../../languages/models/language");
const { createNewPasteLog } = require("../../../../classes/discord");
const rateLimit = require("express-rate-limit");
const createPasteRateLimit = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 5,
	message: {
		error: "Too many pastes created from this ip.",
	},
});
router.use(createPasteRateLimit);
// view
router.post("/", async (request, response) => {
	const { error } = pasteSchemaValidate(request.body);
	if (error) {
		response.status(400).send(error);
		return;
	}
	if (request.body.mode == 2 && !request.body.password) {
		response.status(400).json({
			message:
				"In order to set mode to password protected, Please include password.",
		});
		return;
	}
	try {
		let language = await languageDatabase.getBySlug(request.body.language);
		if (language.length) {
			language = language[0];
			const result = await pasteDatabase.create(
				request.user.id,
				request.body.name,
				request.body.title,
				request.body.content,
				request.body.mode,
				language.id,
				request.body.readme,
				request.body.shortDescription,
				request.body.password
			);
			response.json({
				name: request.body.name,
				id: result.insertId,
			});
			request.body.language = language.slug;
			createNewPasteLog({
				user: request.user,
				paste: request.body,
			});

			return;
		}
		response.status(404).json({
			message: "Language not found.",
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
