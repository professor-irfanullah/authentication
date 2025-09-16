const { query } = require("../../database/db")

const fetchProfile = async (req, res, nex) => {
    const user = req.user
    const fetchQuery = `SELECT
	U.EMAIL,
	EP.PROFILE_PHOTO_URL,
	EP.HEADLINE,
	EP.ABOUT
FROM
	USERS U
	LEFT JOIN EMPLOYER_PROFILES EP ON EP.USER_ID = U.USER_ID
WHERE
	U.USER_ID = $1
	AND U.ROLE = $2`

    try {
        const response = await query(fetchQuery, [user.user_id, 'employee'])
        if (response.rowCount === 1) {
            res.status(200).json({ data: response.rows })
        }
    } catch (error) {
        res.status(500).send(error)
    }
}
module.exports = { fetchProfile }