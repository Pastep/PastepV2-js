const express = require("express");

let router = express.Router();

const create = require("./views/create");
const login = require("./views/login");
const update = require("./views/update");
const get = require("./views/get");

router.use("/create", create);
router.use("/login", login);
router.use("/update", update);
router.use("/get", get);
router.get("/", (request, response) => {
    response.send("this is crud router");
});

module.exports = router;