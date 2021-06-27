const express = require("express");
const router = express.Router();
const { loginSchemaValidate } = require("../../../../classes/schemas");
const userDatabase = require("../../models/user");

router.post("/", async(request, response) => {
    const { error } = loginSchemaValidate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    let user = [];
    if (request.body.username) {
        user = await userDatabase.getByUsername(request.body.username);
    } else if (request.body.email) {
        user = await userDatabase.getByEmail(request.body.email);
    }
    if (user.length) {
        user = user[0];
        if (request.body.password == user.password) {
            if (user.is_verified) {
                const token = userDatabase.uuid4();
                response.status(200).json({
                    token: token,
                });
                await userDatabase.updateById(user.id, {
                    token: token,
                });
                return;
            }
            response.status(401).json({
                message: "Please verify your email.",
            });
            return;
        }
        response.status(401).json({
            message: "Password is incorrect.",
        });
        return;
    }
    response.status(404).json({
        message: "User not found.",
    });
});

module.exports = router;