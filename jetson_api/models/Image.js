const mongoose = require("mongoose")

const ImageSchema = new mongoose.Schema({
    name: String,
    url: String,
    croped: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Image', ImageSchema)