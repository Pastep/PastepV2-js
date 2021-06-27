const express = require("express");
const router = express.Router();
const { userSchemaValidate } = require("../../../../classes/schemas");
const { userWithVerification } = require("../../../../classes/api");
const userDatabase = require("../../models/user");

router.use(userWithVerification);

router.put("/", async(request, response) => {
    const { error } = userSchemaValidate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    try {
        await userDatabase.updateById(request.user.id, {
            username: request.body.username,
            password: request.body.password,
            email: request.body.email,
        });
    } catch (error) {
        if (error.errno == 1062) {
            response.status(300).json({
                message: error.message,
            });
            return;
        }
        throw new Error(error);
    }
    response.json({
        message: "User updated successfully",
    });
});

module.exports = router;