const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { userSchemaValidate } = require("../../../../classes/schemas");
const { userWithVerification } = require("../../../../classes/api");
const userDatabase = require("../../models/user");
const fs = require("fs");
router.use(userWithVerification);

var upload = multer();

router.post("/", upload.single("avatar"), async (request, response) => {
	if (!request.file)
		return response.status(400).send("No files were uploaded!!");
	const avatar = request.file;
	const avatarPath = `${request.user.id}/${Date.now()}.jpg`;

	if (
		!fs.existsSync(
			path.join(
				__dirname,
				"../../../../../public/avatars",
				String(request.user.id)
			)
		)
	) {
		fs.mkdirSync(
			path.join(
				__dirname,
				"../../../../../public/avatars",
				String(request.user.id)
			)
		);
	}
	fs.writeFile(
		path.join(__dirname, "../../../../../public/avatars", avatarPath),
		request.file.buffer,
		function (err) {
			if (err) {
				throw new Error(err);
			}
		}
	);
	try {
		await userDatabase.updateById(request.user.id, {
			avatar: avatarPath,
		});
		response.json({
			message: "avatar updated successfully",
			avatar: avatarPath,
		});
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = router;
