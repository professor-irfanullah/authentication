const { query } = require("../../database/db")

const fetchProfile = async (req, res, nex) => {
    const user = req.user
    const fetchQuery = 'select u.email , ep.company_name , ep.company_description,ep.company_logo_url,ep.website_url,ep.industry,ep.company_size,ep.founded_year,ep.headquarters_location from users u left join employer_profiles ep on ep.user_id = u.user_id where u.user_id = $1 and u.role = $2'

    try {
        const response = await query(fetchQuery, [user.user_id, 'employee'])
        if (response.rowCount === 1) {
            res.status(200).json({ data: response.rows })
        }
    } catch (error) {
        res.status(500).send(error)
    }
}
module.exports = { fetchProfile }