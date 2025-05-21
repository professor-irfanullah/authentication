const { query } = require("../database/db")
const { uploadImageOnCloudinary } = require('../utilities/cloudinary')
const path = require('path')
const fs = require('fs')
/*const { uploadImageOnCloudinary } = require('../utilities/cloudinary')

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
            console.log(fs.existsSync(filePath));

            fs.rm(filePathToRemove, { recursive: true, force: true }, (err) => {
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
*/
const profileHandler = async (req, res, next) => {
    const file = req.file
    const user = req.user
    const urlCheckQuery = `select * from seeker_profiles where user_id = $1`
    const insertQuery = `insert into seeker_profiles(photo_url , user_id) values($1,$2)`
    const updateQuery = `update seeker_profiles set photo_url = $1 where user_id = $2`
    if (!file) {
        const err = new Error('File Not Found!')
        err.statusn = 404
        return next(err)
    }
    try {
        // const filePath = path.join(__dirname, '../public/src')
        const urlCheckResponse = await query(urlCheckQuery, [user.user_id])
        if (urlCheckResponse.rowCount === 0) {
            const cloudinaryResponse = await uploadImageOnCloudinary(file.path)
            if (cloudinaryResponse === null) {
                if (fs.existsSync(file.path)) {
                    fs.unlink(file.path, (err) => {
                        if (err) throw err
                    })
                    console.log('success');

                }

                const err = new Error('Looks like Network disconnected')
                return next(err)
            }
            const secure_url = cloudinaryResponse.secure_url
            const insertQueryResponse = await query(insertQuery, [secure_url, user.user_id])
            if (insertQueryResponse.rowCount === 1) {
                return res.status(201).json({ msg: 'Profile uploaded' })
            }
            const err = new Error('Unable to upload profile picture please try again later')
            return next(err)

        }
        const cloudinaryResponse = await uploadImageOnCloudinary(file.path)
        if (cloudinaryResponse === null) {
            if (fs.existsSync(file.path)) {
                fs.unlink(file.path, (err) => {
                    if (err) throw err
                })
                console.log('success');
            }
            const err = new Error('Something went wrong please try again later')
            return next(err)
        }
        const secure_url = cloudinaryResponse.secure_url
        const updateQueryResponse = await query(updateQuery, [secure_url, user.user_id])
        if (updateQueryResponse.rowCount === 1) {
            if (fs.existsSync(file.path)) {
                fs.unlink(file.path, (err) => {
                    if (err) throw err
                })
                console.log('success');

            }
            return res.status(200).json({ msg: "Profile successfully updated" })
        }
        console.log(fs.existsSync(file.path));

    } catch (error) {
        if (fs.existsSync(file.path)) {
            fs.unlink(file.path, (err) => {
                if (err) throw err
            })
        }
        res.status(500).json({ err: error })
    }

}
module.exports = { profileHandler }