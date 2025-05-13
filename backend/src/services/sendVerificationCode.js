const nodemailer = require('nodemailer');
const EmailVerification = require('../models/emailVerification');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendVerificationCode({ nombre, email }) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await EmailVerification.findOneAndUpdate(
    { email },
    {
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) 
    },
    { upsert: true, new: true }
  );

  await transporter.sendMail({
    from: `"Verificación GoAutos" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Código de verificación de correo',
    html: `
      <h3>Hola ${nombre},</h3>
      <p>Tu código de verificación es:</p>
      <h2>${code}</h2>
      <p>Este código es válido por 10 minutos.</p>
    `
  });

  return { success: true, message: 'Código enviado al correo' };
}

module.exports = { sendVerificationCode };
