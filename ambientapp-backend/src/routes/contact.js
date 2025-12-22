const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configura el transporte SMTP con tus datos
const transporter = nodemailer.createTransport({
  host: 'mail.ambientapp.cl',
  port: 465,
  secure: true, // true para puerto 465
  auth: {
    user: 'hola@ambientapp.cl', // tu correo
    pass: process.env.SMTP_PASS, // la contraseña SMTP (usa variable de entorno)
  },
});

router.post('/', async (req, res) => {
  const { nombre, email, empresa, telefono, mensaje } = req.body;

  if (!nombre || !email || !empresa) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
  }

  const mailOptions = {
    from: `"${nombre}" <${email}>`, // quien envía (el usuario)
    to: 'hola@ambientapp.cl', // tu correo receptor
    subject: `Solicitud de Demo - ${empresa}`,
    text: `
Nombre: ${nombre}
Email: ${email}
Empresa: ${empresa}
Teléfono: ${telefono || 'No proporcionado'}

Mensaje:
${mensaje || 'Sin mensaje adicional'}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error enviando correo:', error);
    res.status(500).json({ success: false, message: 'Error enviando correo' });
  }
});

module.exports = router;