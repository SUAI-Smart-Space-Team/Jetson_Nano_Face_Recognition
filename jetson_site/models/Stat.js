import mongoose from 'mongoose'

const StatSchema = new mongoose.Schema({
    name: String,
    date: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models.Stat || mongoose.model('Stat', StatSchema)
