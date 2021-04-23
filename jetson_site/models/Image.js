import mongoose from 'mongoose'

// image model

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

export default mongoose.models.Image || mongoose.model('Image', ImageSchema)
