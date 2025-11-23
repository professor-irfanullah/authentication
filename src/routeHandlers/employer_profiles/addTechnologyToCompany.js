const { db, query } = require("../../database/db");

const tempErrorHandler = (msg, stat = 400) => {
  const err = new Error(msg);
  err.status = stat;
  return err;
};
// modification required for only HR creation
const addTechnologyToCompany = async (req, res, next) => {
  const { name, company_id } = req.body;
  const user = req.user;

  const chk_HR_query = `select role from company_employees
    where company_id = $1 and user_id = $2`;

  const insertTechnologyQuery = `INSERT INTO TECHNOLOGIES(NAME)
    VALUES($1) returning technology_id`;

  const linkTechnology = `INSERT INTO COMPANY_TECHNOLOGIES(COMPANY_ID, TECH_ID)
    VALUES($1,$2)`;

  if (!name) {
    return next(tempErrorHandler("Missing argument!"));
  }

  if (!parseInt(company_id)) {
    return next(tempErrorHandler("Missing argument!"));
  }

  const client = await db.connect();

  try {
    const role = await client.query(chk_HR_query, [company_id, user.user_id]);

    if (role.rows[0].role !== "HR") {
      return next(tempErrorHandler("Unauthorized access", 401));
    }

    await client.query("BEGIN");
    const response = await client.query(insertTechnologyQuery, [name]);

    const technology_id = response.rows[0].technology_id;

    await client.query(linkTechnology, [company_id, technology_id]);

    await client.query("COMMIT");
    res.status(201).json({ msg: "Technology Added" });
  } catch (error) {
    await client.query("ROLLBACK");
    next(tempErrorHandler("Something went wrong", 500));
  } finally {
    client.release();
  }
};
module.exports = { addTechnologyToCompany };
