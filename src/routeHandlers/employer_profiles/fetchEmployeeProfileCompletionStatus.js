const { query } = require("../../database/db")

const fetchProfilePercentage = async (req, res, next) => {
	const insertionQuery = `select u.name, ((
  CASE 
	WHEN ep.profile_photo_url is not NULL AND EP.PROFILE_PHOTO_URL != 'https://res.cloudinary.com/dvrlvz76t/image/upload/v1752045266/Fa-Team-Fontawesome-FontAwesome-Circle-User.512_1_xpral9.png'  THEN  2
	ELSE    0
END +
  CASE 
	WHEN  ep.headline is not NULL  THEN  1
	ELSE    0
END +
  CASE 
	WHEN ep.about is not NULL   THEN    1
	ELSE    0
END ) * 100 / 4)as profile
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