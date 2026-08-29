const express = require("express");
const router = express.Router();

const {
    saveScore,
    getScores
} = require("../controllers/scoreController");

router.post("/", saveScore);

router.get("/", getScores);

module.exports = router;