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

// Verifica la conexión del transporter (opcional)
transporter.verify(function (error, success) {
  if (error) {
    console.error('Error with Nodemailer transporter:', error);
  } else {
    console.log('Nodemailer transporter is ready to send emails');
  }
});
