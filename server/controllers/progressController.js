const mongoose = require("mongoose");
const Progress = require("../models/Progress");

const inMemoryProgress = new Map();

// Get user's progress
const getProgress = async (req, res) => {
    try {
        const { username, category } = req.query;
        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const progress = await Progress.findOne({ username, category });
            if (!progress) return res.json({ highestLevel: 1 });
            return res.json(progress);
        } else {
            const key = `${username}_${category}`;
            const highestLevel = inMemoryProgress.get(key) || 1;
            return res.json({ username, category, highestLevel });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Save/Update progress
const saveProgress = async (req, res) => {
    try {
        const { username, category, highestLevel } = req.body;
        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            let progress = await Progress.findOne({ username, category });
            if (!progress) {
                progress = new Progress({ username, category, highestLevel });
            } else if (highestLevel > progress.highestLevel) {
                progress.highestLevel = highestLevel;
            }
            await progress.save();
            return res.json(progress);
        } else {
            const key = `${username}_${category}`;
            const current = inMemoryProgress.get(key) || 1;
            const updated = Math.max(current, Number(highestLevel) || 1);
            inMemoryProgress.set(key, updated);
            return res.json({ username, category, highestLevel: updated });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getProgress,
    saveProgress,
};