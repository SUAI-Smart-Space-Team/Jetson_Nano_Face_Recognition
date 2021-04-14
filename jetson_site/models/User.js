import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: String,
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    date: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models?.User || mongoose.model('User', UserSchema)