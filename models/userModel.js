const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
    },
},{timestamps: true})

module.exports = mongoose.model("User", userSchema);