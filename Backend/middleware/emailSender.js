const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: mailOptions.from, // sender address
      to: mailOptions.to, // list of recipients
      subject: mailOptions.subject, // subject line
      text: mailOptions.text, // plain text body
      html: mailOptions.html, // HTML body
    });

    console.log("Message sent: %s", info.messageId);

    // Preview URL is only available when using an Ethereal test account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

module.exports = sendEmail;
