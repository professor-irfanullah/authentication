const { query } = require("../../database/db");

const fetchEmployeeAllJobs = async (req, res, next) => {
	const insertionQuery = `
SELECT
	J.JOB_ID,
	J.TITLE,
	J.DESCRIPTION,
	J.REQUIREMENTS,
	J.LOCATION,
	J.IS_REMOTE,
	J.SALARY_MIN,
	J.SALARY_MAX,
	J.STATUS,
	J.EMPLOYMENT_TYPE,
	J.POSTED_AT,
	J.APPLICATION_DEADLINE,
	J.RESPONSIBILITIES,
	J.POSTED_BY_USER,
	J.COMPANY_ID,
	C.NAME AS COMPANY_NAME,
    C.LOGO_URL AS COMPANY_LOGO
FROM
	JOBS_UPDATED J
	LEFT JOIN COMPANY C ON C.COMPANY_ID = J.COMPANY_ID 
    where j.posted_by_user = $1
	ORDER BY J.JOB_ID DESC
	`
	/*`select * from jobs j left join employer_profiles ep on ep.profile_id = j.employer_id where ep.user_id = $1`;*/
	const user = req.user;

	try {
		const response = await query(insertionQuery, [user.user_id]);
		res.status(200).json(response.rows);
	} catch (error) {
		next(error);
	}
};

module.exports = { fetchEmployeeAllJobs };
