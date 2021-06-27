const express = require("express");
const router = express.Router();
const { getSchemaValidate } = require("../../../../classes/schemas");
const userDatabase = require("../../models/user");
const { createEmail } = require("../../../../classes/email");

router.post("/", async(request, response) => {
    const { error } = getSchemaValidate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    let user;
    if (request.body.username) {
        user = await userDatabase.getByUsername(request.body.username);
    } else if (request.body.id) {
        user = await userDatabase.getById(request.body.id);
    } else if (request.body.email) {
        user = await userDatabase.getByEmail(request.body.email);
    } else {
        if (!request.body.new_password) {
            response.status(400).json({
                message: "Username or email or id AND new_password is required",
            });
        } else {
            response.status(400).json({
                message: "Username or email or id is required",
            });
        }
        return;
    }

    if (user.length) {
        user = user[0];
        if (!user.is_verified) {
            response.status(401).json({
                message: "Please Verify Email.",
            });
            return;
        }
        response.json({
            message: "Email sent.",
        });
        const token = userDatabase.uuid4();
        await userDatabase.updateById(user.id, {
            tmp_password: request.body.new_password,
            verification_code: token,
        });
        await createEmail({
            from: "noreply@pastep.com",
            to: user.email,
            subject: "Password reset code",
            text: token,
        });
        return;
    } else {
        response.status(404).json({
            message: "User not found.",
        });
        return;
    }
});

module.exports = router;