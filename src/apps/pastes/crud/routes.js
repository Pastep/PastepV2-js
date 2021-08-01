const express = require("express");
const router = express.Router();

// functions
const { userWithVerification } = require("../../../classes/api");

const read = require("./views/read");
router.use("/read", read);

const all = require("./views/all");
router.use("/all", all);

const pasteComments = require("./views/pasteComments");
router.use("/comments/all", pasteComments);

const search = require("./views/search");
router.use("/search", search);

// middleware
router.use(userWithVerification);
// views

const create = require("./views/create");
const update = require("./views/update");
const deletePaste = require("./views/delete");
const toggleLike = require("./views/toggleLike");
const addComment = require("./views/addComment");
const delComment = require("./views/delComment");

router.use("/create", create);
router.use("/delete", deletePaste);
router.use("/update", update);
router.use("/likes/toggle", toggleLike);
router.use("/comments/create", addComment);
router.use("/comments/delete", delComment);

module.exports = router;
