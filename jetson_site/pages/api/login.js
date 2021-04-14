import dbConnect from '../../utils/dbConnect'
export default async function handler(req, res) {
    const { method } = req

    await dbConnect()

    switch (method) {
        case 'POST':
            try {
                if (req.body.values.login === process.env.CLOUD_NAME && req.body.values.password === process.env.API_KEY) {
                    res.status(201).json({ success: true, data: 'Successful' })
                } else {
                    res.status(201).json({ success: true, data: 'Login is not valid' })
                }
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}
