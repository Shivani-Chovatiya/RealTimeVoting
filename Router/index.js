const express = require("express");
const router = express.Router();
const AllRouter = require("./Route");

router.use("/", AllRouter);
module.exports = router;
