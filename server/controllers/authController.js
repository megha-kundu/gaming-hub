const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// In-memory fallback user store for offline / demo mode
const inMemoryUsers = new Map();

// REGISTER
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                username,
                password: hashedPassword,
            });

            return res.json({ message: "User registered successfully", user: { username: user.username } });
        } else {
            // Fast in-memory fallback
            if (inMemoryUsers.has(username)) {
                return res.status(400).json({ message: "User already exists" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = { username, password: hashedPassword };
            inMemoryUsers.set(username, user);
            return res.json({ message: "User registered successfully", user: { username } });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const isMongoConnected = mongoose.connection.readyState === 1;

        let userFound = null;

        if (isMongoConnected) {
            userFound = await User.findOne({ username });
        } else {
            userFound = inMemoryUsers.get(username);
        }

        if (!userFound) {
            // Auto-create user in demo mode for frictionless experience
            const hashedPassword = await bcrypt.hash(password, 10);
            userFound = { username, password: hashedPassword };
            inMemoryUsers.set(username, userFound);
        }

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { username: userFound.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: { username: userFound.username }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};