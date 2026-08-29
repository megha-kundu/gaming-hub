const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    type: String,
    question: String,
    options: [String],
    correct: Number,

    image: String,   // For Image Question
    left: String,    // For Slide Match
    right: String,   // For Slide Match

    category: String,
    subject: String,

    level: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model("Question", questionSchema);