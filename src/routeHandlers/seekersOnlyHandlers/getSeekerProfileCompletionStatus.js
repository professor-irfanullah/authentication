const { query } = require("../../database/db");

const getSeekerProfileCompletionPercentage = async (req, res, next) => {
    const user = req.user;
    const insertionQuery = `SELECT
	U.NAME ,
	(
		(
			CASE
				WHEN SP.HEADLINE IS NOT NULL THEN 1
				ELSE 0
			END + CASE
				WHEN SP.BIO IS NOT NULL THEN 1
				ELSE 0
			END + CASE
				WHEN SP.LOCATION IS NOT NULL THEN 1
				ELSE 0
			END + CASE
				WHEN SP.RESUME_URL IS NOT NULL THEN 2
				ELSE 0
			END + CASE
				WHEN SP.LINKEDIN_URL IS NOT NULL THEN 1
				ELSE 0
			END + CASE
				WHEN SP.GITHUB_URL IS NOT NULL THEN 1
				ELSE 0
			END + CASE
				WHEN SP.PHOTO_URL IS NOT NULL
				AND SP.PHOTO_URL != 'https://res.cloudinary.com/dvrlvz76t/image/upload/v1752045266/Fa-Team-Fontawesome-FontAwesome-Circle-User.512_1_xpral9.png' THEN 1
				ELSE 0
			END + CASE
				WHEN EXISTS (
					SELECT
						1
					FROM
						SEEKER_SKILLS SK
					WHERE
						SK.USER_ID = U.USER_ID
						AND SK.SKILL_NAME IS NOT NULL
						AND SK.PROFICIENCY_LEVEL IS NOT NULL
						AND SK.YEARS_OF_EXPERIENCE IS NOT NULL
				) THEN 2
				ELSE 0
			END + CASE
				WHEN EXISTS (
					SELECT
						1
					FROM
						SEEKER_EDUCATION SE
					WHERE
						SE.USER_ID = U.USER_ID
						AND SE.INSTITUTION IS NOT NULL
						AND SE.DEGREE IS NOT NULL
						AND SE.FIELD_OF_STUDY IS NOT NULL
						AND SE.START_DATE IS NOT NULL
						AND SE.END_DATE IS NOT NULL
				) THEN 2
				ELSE 0
			END
		) * 100 / 12
	) AS PROFILE_COM_PERC
FROM
	USERS U
	 left JOIN SEEKER_PROFILES SP ON SP.USER_ID = U.USER_ID
	where u.user_id = $1;
`

    try {
        const response = await query(insertionQuery, [user.user_id])
        if (response.rowCount === 1) {
            return res.status(200).json({ msg: response.rows })
        }
    } catch (error) {
        res.status(500).json({ err: error })
    }
}
module.exports = { getSeekerProfileCompletionPercentage }