
import path from 'path'
import slugify from 'slugify'
import formidable from 'formidable-serverless'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async (req, res) => {

    const data = new Promise((resolve, reject) => {
        const form = formidable({
            multiple: true,
            uploadDir: './public/uploads'
        })

        form.keepExtensions = true
        form.keepFileName = true

        form.on('fileBegin', (name, file) => {
            file.path = path.join('public/uploads', slugify(file.name))
        })

        form.parse(req, (err, fields, files) => {
            if (err) reject(err)
            resolve(files)
        })
    })

    res.status(200).send(data)
}