const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    highestLevel: {
        type: Number,
        default: 1,
    },
});

module.exports = mongoose.model("Progress", progressSchema);