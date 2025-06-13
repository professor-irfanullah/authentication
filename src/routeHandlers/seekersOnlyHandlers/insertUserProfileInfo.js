const { query } = require('../../database/db')
const insertUserProfileInfo = async (req, res, next) => {
    const checkQuery = `select profile_id from seeker_profiles where user_id = $1`
    const updateQuery = `update seeker_profiles set headline = $1 , bio = $2 , location = $3  , linkedin_url = $4 , github_url = $5 where user_id = $6`
    const insertionQuery = `insert into seeker_profiles(user_id , headline , bio , location  ,linkedin_url ,github_url ) values($1,$2,$3,$4,$5, $6)`
    const user = req.user
    const { headline, bio, location, linkedin_url, github_url } = req.body

    if (headline == '' || bio == '' || location == '' || linkedin_url == '' || github_url == '') {
        const err = new Error(`All fields are required!`)
        err.status = 400
        return next(err)
    }
    try {
        const dbResponse = await query(checkQuery, [user.user_id])
        if (dbResponse.rows.length) {
            const updateDBResponse = await query(updateQuery, [headline, bio, location, linkedin_url, github_url, user.user_id])
            if (updateDBResponse.rowCound === 1) {
                return res.status(201).json({ msg: "operation successful" })
            }
            return res.status(200).json({ msg: 'operation successful' })
        }
        const insertDBResponse = await query(insertionQuery, [user.user_id, headline, bio, location, linkedin_url, github_url])
        res.send(insertDBResponse)
    } catch (error) {
        if (error.constraint === 'seeker_profiles_user_id_fkey') {
            const err = new Error('user does not exists!')
            err.status = 404
            return next(err)
        }
        const err = new Error(error.message)
        next(err)
    }
}
module.exports = { insertUserProfileInfo }