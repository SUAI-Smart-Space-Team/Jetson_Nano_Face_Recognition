import dbConnect from '../../utils/dbConnect'
import Image from '../../models/Image'
import User from '../../models/User'

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
        // case 'POST':
        //     try {
        //         const user = await User.create(
        //             req.body
        //         )
        //         res.status(201).json({ success: true, data: user })
        //     } catch (error) {
        //         res.status(400).json({ success: false })
        //     }
        //     break
        default:
            res.status(400).json({ success: false })
            break
    }
}
