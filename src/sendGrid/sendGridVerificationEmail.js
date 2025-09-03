require('dotenv').config()
const sendGrid = require('@sendgrid/mail')
const sendEmail = async (to_email, verification_link) => {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY)
    if (!to_email) {
        throw new error("Email is required")
    }
    if (!verification_link) {
        throw new error('Verifcation Link is missing')
    }
    try {
        const emailTemplate =
            `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #2c3e50;">Welcome to Job Connect!</h2>
                <p>Thank you for signing up. To complete your registration and start exploring job opportunities, please verify your email address.</p>
                <p style="margin: 20px 0;">
                    <a href="${verification_link}" 
                       style="display: inline-block; padding: 12px 20px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 5px;">
                        Confirm Email Address
                    </a>
                </p>
                <p>If you did not create an account on our job board, you can safely ignore this email.</p>
                <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #888;">Need help? Contact our support team at khanprofessor1212@gmail.com</p>
            </div>`;
        const msg = {
            to: to_email,
            from: process.env.adminEmail,
            subject: "Verify Your Email - Welcome to Job Connect",
            html: emailTemplate
        }
        await sendGrid.send(msg)
        return { msg: `An Email has been sent to this '${to_email}' please check your inbox and spam folders to verify`, success: true }
    } catch (error) {
        const errMsg = 'Field to send verification Email'
        return { success: false, message: errMsg }
    }
}
module.exports = { sendEmail }