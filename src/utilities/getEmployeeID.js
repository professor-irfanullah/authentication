const { query } = require("../database/db")

const getEmployeeID = async (user_id) => {
    const employeeIdQuery = `select ep.profile_id from employer_profiles ep where EXISTS(select 1 from  jobs j join employer_profiles ep on j.employer_id = ep.profile_id ) AND ep.user_id = $1`
    if (!user_id) {
        throw new Error('Please provide an user_id')
    }

    try {
        const response = await query(employeeIdQuery, [user_id])
        return response.rows
    } catch (error) {
        throw error
    }
}
module.exports = { getEmployeeID } 