const { uploadImageOnCloudinary } = require('../utilities/cloudinary')
const { query } = require('../database/db')
const fs = require('fs')
const path = require('path')
const filePathToRemove = path.join(__dirname, '../public')

const profileHandler = async (req, res, next) => {
    if (!req.file) {
        return res.status(404).json({ err: "File not found" })
    }
    const filePath = req.file.path
    const urlCheckQuery = `select * from seeker_profiles where user_id = $1`
    const insertQuery = `insert into seeker_profiles(user_id , photo_url) values($1 , $2)`
    try {
        const dbResponse = await query(urlCheckQuery, [req.user.user_id])
        if (dbResponse.rows.length) {
            fs.rm(filePathToRemove, { recursive: true }, (err) => {
                if (err) throw err
            })
            const err = new Error('profile image already exists!')
            err.status = 401
            return next(err)
        }
        const response = await uploadImageOnCloudinary(filePath)
        if (response === null) {
            const err = new Error('An error has occured check your network connection and try again')
            err.status = 401
            fs.rm(filePathToRemove, { recursive: true }, (err) => {
                if (err) throw err

            })
            return next(err)
        }

        fs.rm(filePathToRemove, { recursive: true }, (err) => {
            if (err) throw err

        })
        const { secure_url } = response
        await query(insertQuery, [req.user.user_id, secure_url])

        res.status(200).json({ msg: 'file uploaded successfully', url: secure_url })
    } catch (error) {
        const err = new Error(error)
        next(err)
    }

}
module.exports = { profileHandler }