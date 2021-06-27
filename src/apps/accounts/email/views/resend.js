const express = require("express");
const router = express.Router();
const userDatabase = require("../../models/user");
const { createEmail } = require("../../../../classes/email");
const { getSchemaValidate } = require("../../../../classes/schemas");

router.post("/", async(request, response) => {
    const { error } = getSchemaValidate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    let user;
    if (request.body.username) {
        user = await userDatabase.getByUsername(request.body.username);
    } else if (request.body.email) {
        user = await userDatabase.getByEmail(request.body.email);
    } else if (request.body.id) {
        user = await userDatabase.getById(request.body.id);
    } else {
        response.status(400).json({
            message: "username or email or id is required.",
        });
        return;
    }
    if (user.length) {
        user = user[0];
        if (user.is_verified) {
            response.status(300).json({
                message: "User is verified.",
            });
            return;
        }
        response.status(200).json({
            message: "Email has been sent.",
        });
        token = userDatabase.uuid4();
        await userDatabase.updateById(user.id, {
            verification_code: token,
        });
        await createEmail({
            from: "noreply@pastep.com",
            to: user.email,
            subject: "Email verification resend",
            text: token,
        });

        return;
    }
    response.status(404).json({
        message: "User not found.",
    });
});

module.exports = router;