/**
 * 
require('dotenv').config()
const sendGrid = require('@sendgrid/mail')
const sendEmail = async (to_email, verification_link, template = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
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
            </div>`, sub = "Verify Your Email - Welcome to Job Connect") => {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY)
    if (!to_email) {
        throw new error("Email is required")
    }
    if (!verification_link) {
        throw new error('Verifcation Link is missing')
    }
    if (!sub) {
        throw new error('Subject is required')
    } if (!template) {
        throw new error('Email template is required')
    }
    try {
        const msg = {
            to: to_email,
            from: process.env.adminEmail,
            subject: sub,
            html: template
        }
        await sendGrid.send(msg)
        return { msg: `Email was sent successfully`, success: true }
    } catch (error) {
        throw error
    }
}
module.exports = { sendEmail }


brevo implimentation
require('dotenv').config();
const Brevo = require('@getbrevo/brevo');

const sendEmail = async (
    to_email,
    verification_link,
    template = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
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
            </div>`,
    sub = "Verify Your Email - Welcome to Job Connect"
) => {
    if (!to_email) throw new Error("Email is required");
    if (!verification_link) throw new Error("Verification link is missing");
    if (!sub) throw new Error("Subject is required");
    if (!template) throw new Error("Email template is required");

    // Initialize the Brevo API client
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const sender = { email: process.env.adminEmail, name: "Job Connect" };
    const receivers = [{ email: to_email }];

    const sendSmtpEmail = {
        sender,
        to: receivers,
        subject: sub,
        htmlContent: template,
    };

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        return { msg: "Email was sent successfully", success: true };
    } catch (error) {
        console.error("Brevo error:", error.response?.body || error);
        throw error;
    }
};

module.exports = { sendEmail };
 */
// brevo implementation here with templates
require('dotenv').config();
const Brevo = require('@getbrevo/brevo');

const sendEmail = async (
    to_email,
    verification_link,
    templateId = 1 // Use Brevo template ID
) => {
    if (!to_email) throw new Error("Email is required");
    if (!verification_link) throw new Error("Verification link is missing");

    // Initialize the Brevo API client
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const sender = { email: process.env.adminEmail, name: "Job Connect" };
    const receivers = [{ email: to_email }];

    // Using a pre-saved template
    const sendSmtpEmail = {
        sender,
        to: receivers,
        templateId, // Pass the template ID instead of htmlContent
        params: {
            verification_link,
            username: to_email.split('@')[0] // Example param for your template
        },
    };

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        return { msg: "Email was sent successfully", success: true };
    } catch (error) {
        console.error("Brevo error:", error.response?.body || error);
        throw error;
    }
};

module.exports = { sendEmail };
