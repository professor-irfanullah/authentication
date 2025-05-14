const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadFolder = path.join(__dirname, '../public/temp')
const checkFileExistance = async (path) => {
    const folderExists = fs.existsSync(path)
    if (folderExists) return path;
    fs.mkdirSync(path, { recursive: true })


}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = checkFileExistance(uploadFolder)
        return cb(null, uploadFolder)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const uniqueSuffix = Date.now() + '-' + Math.floor(Math.random() * 1E9)
        return cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

const filterFile = (req, file, cb) => {
    const fileTypes = /jpeg|png|jpg/
    const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase())
    const mimetype = fileTypes.test(file.mimetype)
    if (extname && mimetype) {
        return cb(null, true)
    }
    const err = new Error(`File format not supported!`)
    err.status = 401
    return cb(err)
}
const upload = multer({
    storage,
    limits: {
        fileSize: 1 * 1024 * 1024
    },
    fileFilter: filterFile
})
module.exports = upload