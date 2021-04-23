import dbConnect from '../../utils/dbConnect'
import User from '../../models/User'
import Image from '../../models/Image'
import mongoose from 'mongoose'
import { v2 } from 'cloudinary'
import { normalize } from 'path'
export default async function handler(req, res) {
    const { method } = req

    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                const users = await User.find({}).populate('images')
                res.status(200).json({ success: true, data: users })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'POST':
            try {
                const user = await User.findOneAndUpdate({ name: req.body.name }, { "$addToSet": { "images": req.body.images } }, { new: true, upsert: true })
                req.body.images.map(async (id) => {
                    await Image.findByIdAndUpdate(id, { user: user._id })
                })
                res.status(201).json({ success: true, data: user })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'PUT':
            try {
                const { id, name, images } = req.body
                if (!images) {
                    await User.findByIdAndUpdate(id, { name }, (err, doc) => console.log(doc))
                } else {
                    let imageID = []
                    console.log(images)
                    images.forEach(({ path }) => {
                        const objectId = new mongoose.Types.ObjectId()
                        imageID.push(objectId)
                        v2.uploader.upload(
                            normalize(`public/uploads/${path}`),
                            { public_id: objectId },
                            (err, { secure_url, public_id }) => {
                                if (err) return console.log(err)
                                const image = new Image({
                                    name: public_id,
                                    url: secure_url,
                                    user: id,
                                    _id: objectId,
                                    croped: true
                                })
                                image.save(err => console.error(err))
                            }
                        )
                    })
                    await User.findOneAndUpdate({ name }, { "$addToSet": { "images": imageID } }, { new: true, upsert: true })

                }
                // if (!user) {
                //     return res.status(400).json({ success: false })
                // }
                res.status(200).json({ success: true, data: {} })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'DELETE':
            try {
                const { _id, imageId } = req.body

                if (!imageId) {
                    const deleteUser = await User.findByIdAndRemove({ _id }).populate('images')
                    if (!deleteUser) return res.status(400).json({ success: false })

                    deleteUser.images.map(async (image) => {
                        await Image.findByIdAndRemove(image._id)
                    })
                } else {
                    const deleteImage = await User.findByIdAndUpdate(_id, { "$pullAll": { "images": [imageId] } }).populate('images').exec((err, user) =>
                        user.images.forEach((image) => image._id == imageId && image.remove())
                    )
                    // if (!deleteUser) return res.status(400).json({ success: false })

                    // deleteUser.images.map(async (image) => {
                    //     await Image.findByIdAndRemove(image._id)
                    // })
                }

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
