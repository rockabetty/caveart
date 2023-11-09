import nodemailer from "nodemailer";
import { requireEnvVar } from "../logs/envcheck";
import { logger } from "../logs";

let transporter = nodemailer.createTransport({
  host: requireEnvVar('EMAIL_SERVER'),
  port: 587,
  secure: false,
  auth: {
    user: requireEnvVar('EMAIL_USER'),
    pass: requireEnvVar('EMAIL_PASSWORD'),
  }
});

export const sendSingleEmail = async function(
  recipient: string,
  subject: string,
  bodyAsText: string
): Promise<void> {

   let mailOptions = {
    from: `"Caveart Webcomics" <${requireEnvVar('EMAIL_ADDRESS')}>`,
    to: recipient,
    subject,
    text: bodyAsText
  }

  try {
    const sendAttempt = transporter.sendMail(mailOptions);
    logger.log('Message sent: %s', info.messageId);
  } catch (error) {
    logger.log(error);
  }
}
