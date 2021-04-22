const fs = require('fs')
const path = require("path")
const { v2 } = require('cloudinary')
const mongoose = require('mongoose')

const Image = require('../models/Image')
const Stat = require('../models/Stat')

const tmpPath = path.normalize(`${__dirname}/../jetson_tmp/`)
console.log(`tmpPath = ${tmpPath}`)
let f = fs.readdirSync(tmpPath)
console.log(f)
const userController = async (req, res, next) => {
   
    const { id: name } = JSON.parse(req.body);
    
    if (name) {
        Image.findOne({ name }).populate("user").exec((err, image) => {
            const stats = new Stat({
                name: image.user.name
            })
            stats.save(err => console.error(err)) 

            res.send(req.body)
        })
    } else {
        fs.readdir(tmpPath, (err, files) => {
            if (files.length === 0) return
            files.forEach((file) => {
                const objectId = new mongoose.Types.ObjectId()
                v2.uploader.upload(
                    tmpPath + file,
                    { public_id: objectId },
                    (err, { secure_url, public_id }) => {
                        if (err) return console.log(err)
                        const image = new Image({
                            name: public_id,
                            url: secure_url,
                            _id: objectId,
                            croped: !file.indexOf('croped')
                        })
                        image.save(err => console.error(err))
                    }
                )
            })
            const stats = new Stat({
                name: 'Undefined User'
            })
            stats.save(err => console.error(err))
            res.send(req.body)
        })
    }
}

module.exports = userController
