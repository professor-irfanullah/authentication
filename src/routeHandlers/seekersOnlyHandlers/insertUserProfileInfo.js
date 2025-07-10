const { query } = require('../../database/db')
const insertUserProfileInfo = async (req, res, next) => {
    const user = req.user
    const { headline, bio, location, linkedin_url, github_url } = req.body
    const insertionQuery = `insert into seeker_profiles(user_id , headline , bio , location , linkedin_url , github_url)
    values($1,$2,$3,$4,$5,$6) ON CONFLICT(USER_ID) DO UPDATE SET
	HEADLINE = EXCLUDED.HEADLINE,
	BIO = EXCLUDED.BIO,
	LOCATION = EXCLUDED.LOCATION,
	LINKEDIN_URL = EXCLUDED.LINKEDIN_URL,
	GITHUB_URL = EXCLUDED.GITHUB_URL
    `

    try {
        const response = await query(insertionQuery, [user.user_id, headline, bio, location, linkedin_url, github_url])
        if (response.rowCount >= 1) {
            return res.status(201).json({ msg: "records saved successfully" })
        }
    } catch (error) {
        return res.status(400).json({ err: error })
    }
}
module.exports = { insertUserProfileInfo }