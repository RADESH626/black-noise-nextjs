// src/utils/nodemailer.js
import nodemailer from 'nodemailer';

// Configura el transporter de Nodemailer
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., 'smtp.gmail.com'
  port: process.env.EMAIL_PORT, // e.g., 587
  secure: process.env.EMAIL_SECURE === 'true', // Use 'true' for 465, 'false' for other ports
  auth: {
    user: process.env.EMAIL_USER, // Tu dirección de correo electrónico
    pass: process.env.EMAIL_PASS, // Tu contraseña de correo electrónico
  },
});

// Función para enviar correos electrónicos
export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Remitente
      to,         // Lista de destinatarios
      subject,    // Asunto del correo
      html,       // Contenido HTML
    });
    console.log(`Email sent to ${to} with subject: ${subject}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

// Verifica la conexión del transporter (opcional)
transporter.verify(function (error, success) {
  if (error) {
    console.error('Error with Nodemailer transporter:', error);
  } else {
    // console.log('Nodemailer transporter is ready to send emails');
  }
});
