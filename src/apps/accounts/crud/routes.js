const express = require("express");

let router = express.Router();

const create = require("./views/create");
const login = require("./views/login");
const update = require("./views/update");
const get = require("./views/get");
const avatar = require("./views/avatar");
const toggleFollow = require("./views/toggleFollow");
const getFollowers = require("./views/getFollowers");
const getFollowings = require("./views/getFollowings");

router.use("/create", create);
router.use("/login", login);
router.use("/update", update);
router.use("/get", get);
router.use("/avatar", avatar);
router.use("/people/toggleFollow", toggleFollow);
router.use("/people/followers", getFollowers);
router.use("/people/followings", getFollowings);
router.get("/", (request, response) => {
	response.send("this is crud router");
});

module.exports = router;
