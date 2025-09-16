const { query } = require("../../database/db")

const allJobs = async (req, res, next) => {
    const jobFetchQuery = `select j.job_id , j.posted_by_user as employer_id , j.title , j.description , j.requirements , j.location , j.employment_type , j.is_remote , j.salary_min , j.salary_max , j.status , j.posted_at , j.application_deadline , j.responsibilities, c.name as company_name,c.logo_url
from jobs_updated j 
left join employer_profiles ep on ep.user_id = j.posted_by_user
left join company c on c.company_id = j.company_id
where c.is_verified = true
order by j.job_id desc;`
    /*`select j.job_id , j.employer_id , j.title , j.description , j.requirements , j.location , j.employment_type , j.is_remote , j.salary_min , j.salary_max , j.status , j.posted_at , j.application_deadline , j.responsibilities , ep.company_name from jobs j left join employer_profiles ep on ep.profile_id = j.employer_id order by j.job_id desc`*/
    try {
        const response = await query(jobFetchQuery)
        res.status(200).json({ jobs: response.rows })
    } catch (error) {
        next(error)
    }
}
module.exports = { allJobs }