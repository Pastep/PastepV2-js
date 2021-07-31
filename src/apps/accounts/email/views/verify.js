const express = require("express");
const router = express.Router();
const userDatabase = require("../../models/user");
router.get("/:verificationCode", async (request, response) => {
	let user = await userDatabase.getByVerificationCode(
		request.params.verificationCode
	);
	if (user.length) {
		user = user[0];
		await userDatabase.updateById(user.id, {
			is_verified: 1,
		});
		response.redirect("https://pastep.com/accounts/login");
	}
	response.status(401).send("Verification code is incorrect.");
});

module.exports = router;
