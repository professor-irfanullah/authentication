require("dotenv").config();
const { query } = require("../database/db");
const {
  createToken,
  tokenVerification,
} = require("../utilities/hashing&tokens");
const { sendEmail, sendCompanyInvitationEmail } = require("./sendGridVerificationEmail");
const sendInvitationEmail = async (req, res, next) => {

  const data = req.data;
  // generate a token
  const token = createToken(data);
  const link = `${req.protocol}://${req.get(
    "host"
  )}/api/employee/accept/invitation?token=${token}`;
  // let company = null;
  try {
    //  generate a link and send it inside email to the client email account
    await query(
      `update users set verification_token = $1, updated_at = now() where user_id = $2`,
      [token, data.user_id]
    );
    const response = await sendCompanyInvitationEmail(req.data, link);
    res.status(200).json(response);
  } catch (error) {
    if (error.code === 'ENOTFOUND' && error.hostname === 'api.sendgrid.com') {
      const err = new Error('Unable to connect to the internet to provide email service')
      err.status = 400
      return next(err)
    }
    console.log(error);
    res.status(500).json("Something went wrong");
  }
  /*

// console.log(user_id, email, companyId); employee_name,company_name,verification_token,hr_contact_email,hr_contact_number,company_address,current_year
// res.send(req.data)
const response = await sendCompanyInvitationEmail(req.data)
console.log(response);

res.status(201).send(response)
*/
};
module.exports = { sendInvitationEmail };
