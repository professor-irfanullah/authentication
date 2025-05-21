const { query } = require("../../database/db")
const { uploadImageOnCloudinary } = require('../../utilities/cloudinary')
const fs = require('fs')

const uploadSeekerCV = async (req, res, next) => {
    const file = req.file
    const user = req.user
    const urlCheckQuery = `select * from seeker_profiles where user_id = $1`
    const insertQuery = `insert into seeker_profiles(resume_url , user_id) values($1,$2)`
    const updateQuery = `update seeker_profiles set resume_url = $1 where user_id = $2`
    if (!file) {
        const err = new Error('File Not Found!')
        err.statusn = 404
        return next(err)
    }
    try {
        const urlCheckResponse = await query(urlCheckQuery, [user.user_id])
        if (urlCheckResponse.rowCount === 0) {
            const cloudinaryResponse = await uploadImageOnCloudinary(file.path)
            if (cloudinaryResponse === null) {
                console.log(fs.existsSync(file.path));
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
                if (fs.existsSync(file.path)) {
                    fs.unlink(file.path, (err) => {
                        if (err) throw err
                    })
                    console.log('success');

                }
                return res.status(201).json({ msg: 'Resume successfully uploaded' })
            }
            const err = new Error('Unable to upload Resume please try again later')
            return next(err)

        }
        const cloudinaryResponse = await uploadImageOnCloudinary(file.path)
        if (cloudinaryResponse === null) {
            console.log(fs.existsSync(file.path));
            if (fs.existsSync(file.path)) {
                fs.unlink(file.path, (err) => {
                    if (err) throw err
                })
                console.log('success');

            }
            const err = new Error('Looks like network disconnected!')
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
            return res.status(200).json({ msg: "Resume successfully updated" })
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
module.exports = { uploadSeekerCV }