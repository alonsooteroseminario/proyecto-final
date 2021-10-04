const nodemailer = require('nodemailer');

/* --------------------- EMAILS Y MESSAGING --------------------------- */
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.NODEMAIL_USER.toString(),
        pass: process.env.NODEMAIL_PASS.toString()
    }
});

module.exports = transporter