const { query } = require("../../database/db")

const fetchEmployeeCom = async (req, res, next) => {
	const user = req.user
	const fetchQuery = `SELECT
	C.COMPANY_ID,
	U.USER_ID,
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
	COMPANY C
	LEFT JOIN COMPANY_EMPLOYEES CE ON (
		CE.COMPANY_ID = C.COMPANY_ID
	)
	LEFT JOIN USERS U ON U.USER_ID = CE.USER_ID
	WHERE U.USER_ID = $1`

	try {
		const response = await query(fetchQuery, [user.user_id])
		res.send(response.rows)
	} catch (error) {
		console.log(error);

		res.status(500).json(error)
	}
}
module.exports = { fetchEmployeeCom }