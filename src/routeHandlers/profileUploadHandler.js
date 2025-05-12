const { uploadImageOnCloudinary } = require('../utilities/cloudinary')
const { query } = require('../database/db')
const profileHandler = async (req, res, next) => {
    const { path } = req.file
    const user = req.user
    const insertQuery = `insert into seeker_profiles(user_id , photo_url) values($1, $2)`
    try {
        const response = await uploadImageOnCloudinary(path)
        const { secure_url } = response
        const dbResponse = await query(insertQuery, [user.user_id, secure_url])
        console.log(dbResponse);

        res.status(201).json({ url: secure_url, msg: 'profile photo successfully uploaded' })
    }
    catch (err) {
        if (err.code == '23505') {
            const err = new Error(`user profile can only upload a single file!`)
            err.status = 401
            return next(err)
        }

        const error = new Error(err)
        next(error)
    }
}
module.exports = { profileHandler }