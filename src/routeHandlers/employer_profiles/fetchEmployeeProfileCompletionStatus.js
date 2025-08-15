const { query } = require("../../database/db")

const fetchProfilePercentage = async (req, res, next) => {
    const insertionQuery = `select u.name, ((
CASE 
	WHEN  ep.company_name is not NULL  THEN    1
	ELSE    0
END +
  CASE 
	WHEN ep.company_description is not NULL   THEN    1
	ELSE    0
END +
  CASE 
	WHEN  ep.company_logo_url is not NULL  THEN    1
	ELSE    0
END +
  CASE 
	WHEN ep.website_url is not NULL   THEN    1
	ELSE    0
END +
  CASE 
	WHEN  ep.industry is not NULL  THEN    1
	ELSE    0
END +
  CASE 
	WHEN ep.company_size is not NULL   THEN    1
	ELSE    0
END +
  CASE 
	WHEN  ep.headquarters_location is not NULL  THEN    1
	ELSE    0
END +
  CASE 
	WHEN ep.founded_year is not NULL   THEN    1
	ELSE    0
END 
) * 100 / 8)as profile
from users u
left join employer_profiles ep on u.user_id = ep.user_id
where u.user_id = $1
`
    const user = req.user

    try {
        const response = await query(insertionQuery, [user.user_id])
        res.status(200).json(response.rows)
    } catch (error) {
        next(error)

    }
}
module.exports = { fetchProfilePercentage }