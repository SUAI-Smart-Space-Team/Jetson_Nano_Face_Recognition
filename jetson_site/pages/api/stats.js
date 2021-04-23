import dbConnect from '../../utils/dbConnect'
import Stat from '../../models/Stat'

export default async function handler(req, res) {
    const { method } = req

    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                const stats = await Stat.find({}).sort('-date')
                res.status(200).json({ success: true, data: stats })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'DELETE':
            try {
                const stats = await Stat.deleteMany({})

                if (!stats) return res.status(400).json({ success: false })

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
