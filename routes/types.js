const express = require("express");

const { typeList, typeCreate } = require("../controllers/typeControllers");
const router = express.Router();

router.get("/", typeList);

router.post("/", typeCreate);

module.exports = router;
