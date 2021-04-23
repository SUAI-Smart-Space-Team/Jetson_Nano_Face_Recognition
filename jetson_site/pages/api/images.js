import dbConnect from '../../utils/dbConnect'
import Image from '../../models/Image'

export default async function handler(req, res) {
    const { method } = req

    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                const images = await Image.find({ user: null }).sort('-date')
                if (!images) {
                    return res.status(400).json({ success: false })
                }
                res.status(200).json({ success: true, data: images })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'DELETE':
            try {
                const images = await Image.deleteMany({ user: null })

                if (!images) return res.status(400).json({ success: false })

                res.status(200).json({ success: true, data: {} })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}
