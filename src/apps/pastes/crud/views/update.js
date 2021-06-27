const { request } = require("express");
const express = require("express");
const router = express.Router();
const { pasteSchemaValidate } = require("../../../../classes/schemas");
const pasteDatabase = require("../../models/paste");

router.put("/", async(request, response) => {
    const { error } = pasteSchemaValidate(request.body);
    if (error) {
        response.status(400).json({
            message: error,
        });
        return;
    }
    if (request.body.mode == 2) {
        if (!request.body.password) {
            response.status(400).json({
                message: "In order to set mode to password protected, include password",
            });
            return;
        }
    } else {
        request.body.password = null;
    }
    let paste = await pasteDatabase.getById(request.body.id);
    if (paste.length) {
        paste = paste[0];
        if (paste.user == request.user.id) {
            try {
                await pasteDatabase.updateById(paste.id, {
                    name: request.body.name,
                    title: request.body.title,
                    content: request.body.content,
                    mode: request.body.mode,
                    language: request.body.language,
                    readme: request.body.readme,
                    password: request.body.password,
                });
                response.json({
                    message: "Paste successfully updated.",
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
        }
        response.status(403).json({
            message: "Paste is not yours.",
        });
        return;
    }
    response.status(404).json({
        message: "Paste not found.",
    });
});

module.exports = router;