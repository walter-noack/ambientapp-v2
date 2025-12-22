// Utilidad para enviar emails (nodemailer)
const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL
} = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.warn('WARN: faltan variables SMTP en .env para nodemailer');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: SMTP_SECURE === 'true' || SMTP_SECURE === true, // true para 465
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

/**
 * sendMail helper
 * options: { to, subject, html, text }
 */
async function sendMail(options) {
  const mailOptions = {
    from: FROM_EMAIL || `"No Reply" <no-reply@example.com>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

/**
 * sendVerificationEmail(user, token)
 * Envía el email de verificación con link al frontend
 */
async function sendVerificationEmail(user, token) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verifyUrl = `${frontendUrl.replace(/\/$/, '')}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.4; color:#111;">
      <h2>Verifica tu correo</h2>
      <p>Hola ${user.nombre || user.email},</p>
      <p>Haz clic en el siguiente enlace para verificar tu dirección de correo:</p>
      <p><a href="${verifyUrl}" target="_blank" rel="noopener noreferrer">Verificar mi correo</a></p>
      <p>Si el enlace no funciona, copia y pega esta URL en tu navegador:</p>
      <p style="word-break:break-all">${verifyUrl}</p>
      <p>Este enlace expira en 24 horas.</p>
      <p>Saludos,<br/>El equipo</p>
    </div>
  `;

  return sendMail({
    to: user.email,
    subject: 'Verifica tu correo — AmbientApp',
    html,
    text: `Visita el siguiente enlace para verificar tu correo: ${verifyUrl}`
  });
}

module.exports = {
  sendMail,
  sendVerificationEmail
};