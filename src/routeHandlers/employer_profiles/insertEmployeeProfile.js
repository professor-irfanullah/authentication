const { query } = require("../../database/db");
const insertEmployeeProfile = async (req, res) => {
    const {
        profile_photo_url,
        about,
        headline
    } = req.body;
    const user = req.user;
    const insertionQuery = `INSERT INTO
	EMPLOYER_PROFILES (
		USER_ID,
        ABOUT,
        HEADLINE,
		UPDATED_AT
	)
VALUES
	($1, $2,$3 ,now())
ON CONFLICT (USER_ID) DO UPDATE
SET
    ABOUT = EXCLUDED.ABOUT,
    HEADLINE = EXCLUDED.HEADLINE,
    UPDATED_AT = EXCLUDED.UPDATED_AT`;

    try {
        const response = await query(insertionQuery, [
            user.user_id,
            about,
            headline
        ]);
        if (response.rowCount > 0) {
            return res.status(201).json({ msg: "operation successfull" });
        }
        res.status(200).json({ msg: response })
    } catch (error) {
        console.log(error);

        res.status(500).json(error);
    }
};
module.exports = { insertEmployeeProfile };
