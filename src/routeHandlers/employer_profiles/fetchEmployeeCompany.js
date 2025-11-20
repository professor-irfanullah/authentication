const { query } = require("../../database/db")

const fetchEmployeeCom = async (req, res, next) => {
	const user = req.user
	const fetchQuery = `
	SELECT
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

    -- JSON array of ALL employees
    COALESCE(
        JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
                'company_employee_id', CE2.COMPANY_EMPLOYEE_ID,
                'user_id', CE2.USER_ID,
                'status', CE2.STATUS,
                'role', CE2.ROLE,
                'name', U2.NAME,
                'email', U2.EMAIL,
                'user_role', U2.ROLE,
                'created_by_user', C.CREATED_BY_USER_ID,
                'bio', EP.HEADLINE,
                'about', EP.ABOUT,
                'profile_photo', EP.PROFILE_PHOTO_URL
            )
        ) FILTER (WHERE CE2.COMPANY_EMPLOYEE_ID IS NOT NULL),
        '[]'::JSON
    ) AS employees,

    -- JSON array of trending technologies
    COALESCE(
        JSON_AGG(
             JSONB_BUILD_OBJECT(
                'tech_id', T.technology_id,
                'technology', T.NAME
            )
        ) FILTER (WHERE T.technology_id IS NOT NULL),
        '[]'::JSON
    ) AS technologies

FROM
    COMPANY C

    -- This identifies the CURRENT user's role inside the company
    LEFT JOIN COMPANY_EMPLOYEES CE 
        ON CE.COMPANY_ID = C.COMPANY_ID
       AND CE.USER_ID = $1

    LEFT JOIN USERS U ON U.USER_ID = CE.USER_ID
    LEFT JOIN EMPLOYER_PROFILES EP ON EP.USER_ID = U.USER_ID

    -- All employees
    LEFT JOIN COMPANY_EMPLOYEES CE2 
        ON CE2.COMPANY_ID = C.COMPANY_ID
    LEFT JOIN USERS U2 
        ON U2.USER_ID = CE2.USER_ID

    -- Trending technologies tables
	LEFT JOIN COMPANY_TECHNOLOGIES CT ON CT.company_id = C.company_id
	LEFT JOIN technologies T ON T.technology_id = CT.tech_id

WHERE
    CE.USER_ID = $1

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
	/*
		`
		SELECT
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
		JSON_AGG(
			JSON_BUILD_OBJECT(
				'company_employee_id',
				CE2.COMPANY_EMPLOYEE_ID,
				'user_id',
				CE2.USER_ID,
				'status',
				CE2.STATUS,
				'role',
				CE2.ROLE,
				'name',
				U2.NAME,
				'email',
				U2.EMAIL,
				'user_role',
				U2.ROLE,
				'created_by_user',
				C.CREATED_BY_USER_ID,
				'bio',
				EP.HEADLINE,
				'about',
				EP.ABOUT,
				'profile_photo',
				EP.PROFILE_PHOTO_URL
			)
		) FILTER (
			WHERE
				CE2.COMPANY_EMPLOYEE_ID IS NOT NULL
		),
		'[]'::JSON
	) AS EMPLOYEES
FROM
	COMPANY C
	-- Join for the current user's relation to the company
	LEFT JOIN COMPANY_EMPLOYEES CE ON CE.COMPANY_ID = C.COMPANY_ID
	AND CE.USER_ID = $1
	LEFT JOIN USERS U ON U.USER_ID = CE.USER_ID
	LEFT JOIN EMPLOYER_PROFILES EP ON EP.USER_ID = U.USER_ID
	-- Join for all employees of the company
	LEFT JOIN COMPANY_EMPLOYEES CE2 ON CE2.COMPANY_ID = C.COMPANY_ID
	LEFT JOIN USERS U2 ON U2.USER_ID = CE2.USER_ID
	-- Only show companies where the user is an employee
WHERE
	CE.USER_ID = $1
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
	CE.VERIFIED_AT
	`
	*/

	try {
		const response = await query(fetchQuery, [user.user_id])
		res.send(response.rows)
	} catch (error) {
		console.log(error);

		res.status(500).json(error)
	}
}
module.exports = { fetchEmployeeCom }