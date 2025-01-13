const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { API_BASE_URL, FRONTEND_URL } = require('../utils/constants.helper');
const db = require("../models");
const User = db.User;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'localhost',
  port: process.env.EMAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
});

const readHTMLFile = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const file = fs.readFileSync(filePath, { encoding: "utf-8" });
      resolve(file);
    } catch (err) {
      reject(new Error(`Failed to read template file ${filePath}: ${err.message}`));
    }
  });
};

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const sendEmail = async (to, subject, templateName, replacements) => {
  const emailEnabled = process.env.EMAIL_ENABLE === "true";

  if (!emailEnabled) {
    console.log("Email sending is disabled.");
    return;
  }

  const templatePath = path.join(__dirname, `../templates/${templateName}.hbs`);
  const html = await readHTMLFile(templatePath);
  const template = handlebars.compile(html);
  const htmlToSend = template(replacements);

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html: htmlToSend,
  };

  await transporter.sendMail(mailOptions);
};

const sendSignupEmail = async (email, name) => {
  await sendEmail(email, "Welcome to Our Service", "signup", { name });
};

const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetLink = `${FRONTEND_URL}set-new-password?token=${resetToken}`;
  await sendEmail(email, 'Reset your password for Guidefox', 'resetPassword', {
    name,
    resetLink,
  });
};

const sendInviteEmail = async (email) => {
  const inviteLink = FRONTEND_URL;
  await sendEmail(email, 'You’re invited to join Guidefox!', 'invite', {
    inviteLink,
  });
};


module.exports = {
  sendSignupEmail,
  sendPasswordResetEmail,
  sendInviteEmail,
  findUserByEmail,
  transporter,
};
