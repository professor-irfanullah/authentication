const { query } = require("../../database/db")

const fetchEmployeeCom = async (req, res, next) => {
	const user = req.user
	const fetchQuery = /*`SELECT
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
	WHERE U.USER_ID = $1`*/
		`SELECT
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
    CE.VERIFIED_AT,

    -- JSON array of employees with detailed user info
    COALESCE(
        json_agg(
            json_build_object(
                'company_employee_id', CE2.company_employee_id,
                'user_id', CE2.user_id,
                'status', CE2.status,
                'role', CE2.role,
                'name', U2.name,
                'email', U2.email,
                'user_role', U2.role,
				'created_by_user',c.created_by_user_id
            )
        ) FILTER (WHERE CE2.company_employee_id IS NOT NULL),
        '[]'::json
    ) AS employees

FROM COMPANY C

-- Join for the current user's relation to the company
LEFT JOIN COMPANY_EMPLOYEES CE ON CE.COMPANY_ID = C.COMPANY_ID AND CE.USER_ID = 36
LEFT JOIN USERS U ON U.USER_ID = CE.USER_ID

-- Join for all employees of the company
LEFT JOIN COMPANY_EMPLOYEES CE2 ON CE2.COMPANY_ID = C.COMPANY_ID
LEFT JOIN USERS U2 ON U2.USER_ID = CE2.USER_ID

-- Only show companies where the user is an employee
WHERE CE.USER_ID = $1

GROUP BY
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
    CE.VERIFIED_AT;
`

	try {
		const response = await query(fetchQuery, [user.user_id])
		res.send(response.rows)
	} catch (error) {
		console.log(error);

		res.status(500).json(error)
	}
}
module.exports = { fetchEmployeeCom }