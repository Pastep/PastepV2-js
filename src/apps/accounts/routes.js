const express = require("express");
const crudRoutes = require("./crud/routes");
const emailRoutes = require("./email/routes");
const passwordRoutes = require("./password/routes");

let router = express.Router();

router.use("/", crudRoutes);
router.use("/email", emailRoutes);
router.use("/password", passwordRoutes);

module.exports = router;