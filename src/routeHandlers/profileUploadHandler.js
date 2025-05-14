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
        const dbResponse = await query(urlCheckQuery, [9])
        if (dbResponse.rows.length) {
            fs.rm(filePathToRemove, { recursive: true }, (err) => {
                if (err) throw err
                console.log('removed');

            })
            console.log(dbResponse.rows);
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
                console.log('removed');

            })
            return next(err)
        }

        fs.rm(filePathToRemove, { recursive: true }, (err) => {
            if (err) throw err
            console.log('removed');

        })
        const { secure_url } = response
        const insertDbResponse = await query(insertQuery, [9, secure_url])
        console.log(insertDbResponse);

        res.status(200).json({ msg: 'file uploaded successfully' })
    } catch (error) {
        console.log(error);

    }

}
module.exports = { profileHandler }