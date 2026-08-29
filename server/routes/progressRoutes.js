const express = require("express");

const router = express.Router();

const {
    getProgress,
    saveProgress,
} = require("../controllers/progressController");

router.get("/", getProgress);

router.post("/", saveProgress);

module.exports = router;