const express = require("express");
const router = express.Router();
const languageDatabase = require("../models/language");

router.get("/", async(request, response) => {
    const languages = await languageDatabase.all();
    response.send(languages);
});

module.exports = router;