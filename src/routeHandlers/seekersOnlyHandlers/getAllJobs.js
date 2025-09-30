const { query } = require("../../database/db")

const allJobs = async (req, res, next) => {
    const jobFetchQuery = `SELECT
	J.JOB_ID,
	J.POSTED_BY_USER AS EMPLOYER_ID,
	J.TITLE,
	J.DESCRIPTION,
	J.REQUIREMENTS,
	J.LOCATION,
	J.EMPLOYMENT_TYPE,
	J.IS_REMOTE,
	J.SALARY_MIN,
	J.SALARY_MAX,
	J.STATUS,
	J.POSTED_AT,
	J.APPLICATION_DEADLINE,
	J.RESPONSIBILITIES,
	C.NAME AS COMPANY_NAME,
	C.LOGO_URL
FROM
	JOBS_UPDATED J
	LEFT JOIN EMPLOYER_PROFILES EP ON EP.USER_ID = J.POSTED_BY_USER
	LEFT JOIN COMPANY C ON C.COMPANY_ID = J.COMPANY_ID
WHERE
	C.IS_VERIFIED = TRUE
ORDER BY
	J.JOB_ID DESC;`
    /*`select j.job_id , j.employer_id , j.title , j.description , j.requirements , j.location , j.employment_type , j.is_remote , j.salary_min , j.salary_max , j.status , j.posted_at , j.application_deadline , j.responsibilities , ep.company_name from jobs j left join employer_profiles ep on ep.profile_id = j.employer_id order by j.job_id desc`*/
    try {
        const response = await query(jobFetchQuery)
        res.status(200).json({ jobs: response.rows })
    } catch (error) {
        next(error)
    }
}
module.exports = { allJobs }