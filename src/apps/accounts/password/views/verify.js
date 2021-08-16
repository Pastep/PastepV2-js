const express = require("express");
const router = express.Router();
const userDatabase = require("../../models/user");
router.get("/:verificationCode", async (request, response) => {
	let user = await userDatabase.getByVerificationCode(
		request.params.verificationCode
	);
	if (user.length) {
		user = user[0];
		if (user.is_verified) {
			await userDatabase.updateById(user.id, {
				verification_code: userDatabase.uuid4(),
				password: user.tmp_password,
			});
			response.redirect("https://pastep.com/accounts/login");
			return;
		}
		response.status(401).send("Please verify email.");
		return;
	}
	response.status(401).send("Verification code is incorrect.");
});

module.exports = router;
