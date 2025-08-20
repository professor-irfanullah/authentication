const { query } = require("../../database/db");
const errFunction = (errMsg) => {
    const err = new Error(errMsg);
    err.status = 401;
    return err;
};
const insertEmployeeProfile = async (req, res, next) => {
    const {
        company_name,
        company_description,
        company_logo_url,
        website_url,
        industry,
        company_size,
        founded_year,
        headquarters_location,
    } = req.body;
    const user = req.user;
    const insertionQuery = `insert into employer_profiles(user_id , company_name , company_description , company_logo_url , website_url , industry , company_size , founded_year , headquarters_location, updated_at)
    values($1,$2,$3,$4,$5,$6,$7,$8,$9 , $10) 
    on conflict (user_id) do update set company_name = excluded.company_name, company_description = excluded.company_description,company_logo_url = excluded.company_logo_url , website_url = excluded.website_url , company_size = excluded.company_size, founded_year = excluded.founded_year, headquarters_location = excluded.headquarters_location , industry = excluded.industry`;

    if (!company_name) {
        return next(errFunction("Company name is required"));
    }
    try {
        const response = await query(insertionQuery, [
            user.user_id,
            company_name,
            company_description,
            company_logo_url,
            website_url,
            industry,
            company_size,
            founded_year,
            headquarters_location,
            "now()",
        ]);
        if (response.rowCount > 0) {
            res.status(201).json({ msg: "operation successfull" });
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ err: error });
    }
};
module.exports = { insertEmployeeProfile };
