const express = require("express");
const router = express.Router();

const userDatabase = require("../../models/user");
const { getSchemaValidate } = require("../../../../classes/schemas");

router.get("/", async(request, response) => {
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
        response.status(400).json({
            message: "Username or email or id is required",
        });
        return;
    }
    if (user.length) {
        user = user[0];
        response.json({
            id: user.id,
            username: user.username,
        });
        return;
    }
    response.status(404).json({
        message: "User not found.",
    });
});

module.exports = router;