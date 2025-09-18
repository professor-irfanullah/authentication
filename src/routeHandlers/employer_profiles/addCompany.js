const { query } = require('../../database/db')
const customErrorGenerator = (er, status = 500, next) => {
    const err = new Error(er)
    err.status = status
    return next(err)
}
const addCompany = async (req, res, next) => {
    const { name, description, website_url, logo_url, address, industry, company_size } = req.body
    const user = req.user
    const insertionQuery = `INSERT INTO
	COMPANY (
		NAME,
		DESCRIPTION,
		WEBSITE_URL,
		LOGO_URL,
		CREATED_BY_USER_ID,
        ADDRESS,
        INDUSTRY,
        COMPANY_SIZE
	) VALUES (
		$1,
		$2,
		$3,
		$4,
		$5,
        $6,
        $7,
        $8
	);`
    if (!name || !name.trim()) {
        return customErrorGenerator('The name field is required', 400, next)
    }
    if (!description || !description.trim()) {
        return customErrorGenerator('The description field is required', 400, next)
    } if (!website_url || !website_url.trim()) {
        return customErrorGenerator('The website_url field is required', 400, next)
    } if (!logo_url || !logo_url.trim()) {
        return customErrorGenerator('The logo_url field is required', 400, next)
    }
    if (!address || !address.trim()) {
        return customErrorGenerator('The Address field is required', 400, next)
    }
    if (!industry || !industry.trim()) {
        return customErrorGenerator('The Industry field is required', 400, next)
    }
    if (!company_size || company_size === '') {
        return customErrorGenerator('The Company Size field is required', 400, next)
    }


    try {
        const response = await query(insertionQuery, [name, description, website_url, logo_url, user.user_id, address, industry, company_size])
        if (response.rowCount === 1) {
            return res.status(201).json({ msg: `Company ${name} added successfully` })
        }
        res.send(response)
    } catch (error) {
        if (error.constraint === 'company_name_key') {
            return customErrorGenerator(`The name ${name} already exists`, 403, next)
        }
        next(error)
    }
};
module.exports = { addCompany }