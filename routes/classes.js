const express = require("express");

const { classList } = require("../controllers/classControllers");
const router = express.Router();

router.get("/", classList);

module.exports = router;
