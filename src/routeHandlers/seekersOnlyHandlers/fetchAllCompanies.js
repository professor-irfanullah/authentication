const { query } = require('../../database/db')
const fetchAllCompanies = async (req, res, next) => {
    const dbQuery = `SELECT
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
    CE.VERIFIED_AT;`
    try {
        const response = await query(dbQuery, [])
        res.status(200).json(response.rows)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ err: "Something went wrong while fetching companies please try again later" })
    }
}
module.exports = { fetchAllCompanies }