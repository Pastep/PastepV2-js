const express = require("express");
const router = express.Router();

// functions
const { userWithVerification } = require("../../../classes/api");

const read = require("./views/read");
router.use("/read", read);

// middleware
router.use(userWithVerification);
// views

const create = require("./views/create");
const update = require("./views/update");
const deletePaste = require("./views/create");

router.use("/create", create);
router.use("/delete", deletePaste);
router.use("/update", update);

module.exports = router;