const { query } = require("../../database/db")

const fetchEmployeeCom = async (req, res, next) => {
	const user = req.user
	const fetchQuery = `SELECT
	C.COMPANY_ID,
	C.NAME,
	C.LOGO_URL,
	C.DESCRIPTION,
	C.WEBSITE_URL,
	C.ADDRESS,
	C.FOUNDED_YEAR,
	C.INDUSTRY,
	C.COMPANY_SIZE,
	C.IS_VERIFIED,
	CE.ROLE,
	CE.VERIFIED_AT
FROM
	USERS U
    LEFT JOIN company C ON C.created_by_user_id = U.user_id
	LEFT JOIN COMPANY_EMPLOYEES CE ON CE.USER_ID = C.created_by_user_id
WHERE
	U.USER_ID = $1`

	try {
		const response = await query(fetchQuery, [user.user_id])
		res.send(response.rows)
	} catch (error) {
		console.log(error);

		res.status(500).json(error)
	}
}
module.exports = { fetchEmployeeCom }