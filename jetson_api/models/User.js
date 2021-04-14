const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: String,
    surname: String,
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema)