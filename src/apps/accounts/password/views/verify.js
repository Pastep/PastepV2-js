const express = require("express");
const router = express.Router();
const userDatabase = require("../../models/user");
router.get("/:verificationCode", async(request, response) => {
    let user = await userDatabase.getByVerificationCode(
        request.params.verificationCode
    );
    if (user.length) {
        user = user[0];
        if (user.is_verified) {
            await userDatabase.updateById(user.id, {
                password: user.tmp_password,
                tmp_password: null,
            });
            response.status(200).send("Password changed.");
            return;
        }
        response.status(401).send("Please verify email.");
    }
    response.status(401).send("Verification code is incorrect.");
});

module.exports = router;