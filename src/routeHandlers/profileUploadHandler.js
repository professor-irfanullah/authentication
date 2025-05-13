const { uploadImageOnCloudinary } = require('../utilities/cloudinary')
const { query } = require('../database/db')
const profileHandler = async (req, res, next) => {
    const { path } = req.file
    const user = req.user
    const userCheckQuery = `select photo_url from seeker_profiles where user_id = $1`
    const insertQuery = `insert into seeker_profiles(user_id , photo_url) values($1, $2)`
    try {
        const response = await query(userCheckQuery, [user.user_id])

        if (response.rows.length) {
            const err = new Error(`Profile picture already exists!`)
            err.status = 403
            return next(err)
        }
        const uploadResponse = await uploadImageOnCloudinary(path)
        const { secure_url } = uploadResponse
        await query(insertQuery, [user.user_id, secure_url])
        res.status(201).json({ url: secure_url, msg: 'profile photo successfully uploaded' })
    }
    catch (err) {
        if (err.code == '23505') {
            const err = new Error(`user profile already exists!`)
            err.status = 401
            return next(err)
        }
        const error = new Error(err)
        next(error)
    }
}
module.exports = { profileHandler }