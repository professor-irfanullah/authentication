const { query } = require("../../database/db")
const { getEmployeeID } = require('../../utilities/getEmployeeID')
const fetchData = async (req, res, next) => {
  const user = req.user
  const tempQuery = `SELECT 
  AP.application_id,
  U.name,
  U.email,
  J.title,
  J.job_id,
  J.employment_type,
  J.is_remote,
  J.location,
  AP.applied_at,
  AP.application_status,
  SP.resume_url,
  SP.photo_url,
  AP.cover_letter,
  SP.bio,
  COALESCE(E.education, '[]') AS education,
  COALESCE(sk.skills , '[]') AS skills
FROM users U
JOIN applications AP ON AP.user_id = U.user_id
LEFT JOIN seeker_profiles SP ON SP.user_id = AP.user_id
LEFT JOIN jobs_updated J ON J.job_id = AP.job_id
LEFT JOIN (
  SELECT 
    SE.user_id,
    json_agg(
      json_build_object(
        'institution', SE.institution,
        'degree', SE.degree,
        'field_of_study', SE.field_of_study,
        'start_date', SE.start_date,
        'end_date', SE.end_date
      )
    ) AS education
  FROM seeker_education SE
  GROUP BY SE.user_id
) E ON E.user_id = U.user_id
 left join (
	select sk.user_id , json_agg(json_build_object(
    'skill_name',sk.skill_name,
      'proficiency_level',sk.proficiency_level,
      'years_of_experiences',sk.years_of_experience
    )) as skills from seeker_skills sk GROUP BY sk.user_id
) sk on sk.user_id = u.user_id
WHERE J.posted_by_user = $1;

`
  try {
    const response = await query(tempQuery, [user.user_id])
    return res.status(200).json(response.rows)
  } catch (error) {
    next(error)
  }
}
module.exports = { fetchData }