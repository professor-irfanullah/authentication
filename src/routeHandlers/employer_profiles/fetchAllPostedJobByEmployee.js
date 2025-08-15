const { query } = require("../../database/db");

const fetchEmployeeAllJobs = async (req, res, next) => {
    const insertionQuery = `select * from jobs j left join employer_profiles ep on ep.profile_id = j.employer_id where ep.user_id = $1`;
    const user = req.user;

    try {
        const response = await query(insertionQuery, [user.user_id]);
        res.status(200).json(response.rows);
    } catch (error) {
        next(error);
    }
};

module.exports = { fetchEmployeeAllJobs };
