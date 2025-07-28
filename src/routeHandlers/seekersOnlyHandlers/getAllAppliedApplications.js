const { query } = require("../../database/db");

const getAllAppliedApplications = async (req, res, next) => {
    const insertionQuery = `SELECT
	J.TITLE,
	J.LOCATION,
	AP.APPLIED_AT,
	AP.APPLICATION_STATUS,
	AP.APPLICATION_ID
FROM
	JOBS J
	JOIN APPLICATIONS AP ON J.JOB_ID = AP.JOB_ID
WHERE
	AP.USER_ID = $1`;
    const user = req.user

    try {
        const response = await query(insertionQuery, [user.user_id])
        res.send(response.rows)
    } catch (error) {
        res.send(error);

    }
};
module.exports = { getAllAppliedApplications };
