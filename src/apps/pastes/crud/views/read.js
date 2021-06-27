const express = require("express");
const markdown = require("markdown").markdown;
const router = express.Router();
const pasteDatabase = require("../../models/paste");
const userDatabase = require("../../../accounts/models/user");

router.get("/", async(request, response) => {
    let paste;
    if (request.body.id) {
        paste = await pasteDatabase.getById(request.body.id);
    } else if (request.body.name) {
        paste = await pasteDatabase.getByName(request.body.name);
    } else {
        response.status(400).json({
            message: "id or name is required.",
        });
        return;
    }
    if (paste.length) {
        paste = paste[0];
        if (paste.mode == 1) {
            if (request.headers["authorization"]) {
                if (request.headers.authorization.startsWith("Bearer")) {
                    let authorization = request.headers.authorization.replace(
                        "Bearer ",
                        ""
                    );
                    let result = await userDatabase.getByToken(authorization);
                    if (result.length != 0) {
                        result = result[0];
                        if (!result.is_verified) {
                            response.status(403).json({
                                message: "Please verify your email.",
                            });
                        } else {
                            if (result.id != paste.user) {
                                response.status(403).json({
                                    message: "Paste mode is private, and authorization header is not same as paste.",
                                });
                                return;
                            }
                            response.json({
                                id: paste.id,
                                name: paste.name,
                                title: paste.title,
                                content: paste.content,
                                mode: paste.mode,
                                readme: markdown.toHTML(paste.readme),
                            });
                            return;
                        }
                    } else {
                        response.status(401).json({
                            message: "Token is incorrect.",
                        });
                    }
                }
            }
            response.status(400).json({
                message: "Authorization is missing.",
            });
        } else if (paste.mode == 2) {
            if (request.body.password) {
                if (paste.password != request.body.password) {
                    response.status(401).json({
                        message: "Password is incorrect.",
                    });
                    return;
                }
            } else {
                response.status(400).json({
                    message: "Paste is password protected, Please include a password.",
                });
                return;
            }
        }
        response.json({
            id: paste.id,
            name: paste.name,
            title: paste.title,
            content: paste.content,
            mode: paste.mode,
            readme: markdown.toHTML(paste.readme),
        });
        return;
    } else {
        response.status(404).json({
            message: "Paste not found.",
        });
        return;
    }
});

module.exports = router;