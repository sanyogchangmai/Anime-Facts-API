const mongoose = require("mongoose");

const animeFactsSchema = mongoose.Schema({
    anime: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    body: {
        type: String,
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model("Facts", animeFactsSchema);