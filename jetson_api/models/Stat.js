const mongoose = require("mongoose")

const StatSchema = new mongoose.Schema({
    name: String,
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Stat', StatSchema)