const express = require("express");
const router = express.Router();
const languageDatabase = require("../models/language");
const { languageGetSchemaValidate } = require("../../../classes/schemas");

router.get("/", async(request, response) => {
    const { error } = languageGetSchemaValidate(request.body);
    if (error) {
        response.status(400).json(error);
        return;
    }
    let language;
    if (request.body.id >= 0) {
        language = await languageDatabase.getById(request.body.id);
    } else if (request.body.slug) {
        language = await languageDatabase.getBySlug(request.body.slug);
    }
    console.log(language);
    if (language.length) {
        response.json(language[0]);
        return;
    }
    response.status(404).json({
        message: "Language not found.",
    });
});

module.exports = router;