const express = require("express");
const router = express.Router();
const { pasteSchemaValidate } = require("../../../../classes/schemas");
const pasteDatabase = require("../../models/paste");
const languageDatabase = require("../../../languages/models/language");

// view
router.post("/", async(request, response) => {
    const { error } = pasteSchemaValidate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    if (request.body.mode == 2 && !request.body.password) {
        response.status(400).json({
            message: "In order to set mode to password protected, Please include password.",
        });
        return;
    }
    try {
        const language = await languageDatabase.getById(request.body.language);
        if (language.length) {
            const result = await pasteDatabase.create(
                request.user.id,
                request.body.name,
                request.body.title,
                request.body.content,
                request.body.mode,
                request.body.language,
                request.body.readme,
                request.body.password
            );
            response.status(201).json({
                id: result.insertId,
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