const multer = require('multer')
const path = require('path')
const fs = require('fs')
const uploadDir = path.join(__dirname, 'public/temp');

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// File filter function for validation
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const filetypes = /jpeg|jpg|png/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        const err = new Error('file format not supported , please provide jpeg , jpg , png')
        err.status = 401
        cb(err);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: fileFilter
})

module.exports = upload