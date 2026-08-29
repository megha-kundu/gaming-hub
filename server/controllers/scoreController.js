const mongoose = require("mongoose");
const Score = require("../models/Score");

const inMemoryScores = [];

exports.saveScore = async (req, res) => {
    try {
        const isMongoConnected = mongoose.connection.readyState === 1;
        if (isMongoConnected) {
            const score = new Score(req.body);
            await score.save();
            return res.status(201).json({ message: "Score Saved Successfully ✅", score });
        } else {
            inMemoryScores.push({ ...req.body, createdAt: new Date() });
            return res.status(201).json({ message: "Score Saved Successfully ✅", score: req.body });
        }
    } catch (err) {
        res.status(500).json({ message: "Error Saving Score", error: err.message });
    }
};

exports.getScores = async (req, res) => {
    try {
        const isMongoConnected = mongoose.connection.readyState === 1;
        if (isMongoConnected) {
            const scores = await Score.find().sort({ score: -1 }).limit(10);
            return res.json(scores);
        } else {
            const sorted = [...inMemoryScores].sort((a, b) => b.score - a.score).slice(0, 10);
            return res.json(sorted.length > 0 ? sorted : [
                { username: 'Aarav', score: 120, category: 'Vocabulary' },
                { username: 'Ananya', score: 100, category: 'Grammar' },
                { username: 'Rohan', score: 90, category: 'Spelling' }
            ]);
        }
    } catch (err) {
        res.status(500).json({ message: "Error Fetching Scores", error: err.message });
    }
};