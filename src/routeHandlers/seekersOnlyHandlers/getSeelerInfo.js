const { query } = require("../../database/db")

const getSeekerData = async (req, res, next) => {
    const user = req.user
    const getQuery = 'select * from users u left join seeker_profiles sp on u.user_id = sp.user_id where u.user_id = $1'

    try {
        const response = await query(getQuery, [user.user_id])
        if (response.rows.length === 0) {
            const err = new Error('The Record does not exists')
            err.status = 404
            return next(err)
        }
        const userInfo = {
            name: response.rows[0].name,
            email: response.rows[0].email,
            headline: response.rows[0].headline,
            bio: response.rows[0].bio,
            location: response.rows[0].location,
            phone: response.rows[0].phone,
            resume_url: response.rows[0].resume_url,
            linkedin_url: response.rows[0].linkedin_url,
            github_url: response.rows[0].github_url,
            photo_url: response.rows[0].photo_url,
            is_public: response.rows[0].is_public
        }
        res.status(200).json({ data: userInfo })
    } catch (error) {
        res.status(500).json({ err: error })
    }
}
module.exports = { getSeekerData }