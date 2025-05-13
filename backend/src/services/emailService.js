require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function enviarCorreoContacto(nombre, correo) {
  try {
    await transporter.sendMail({
      from: `"Formulario Web" <${process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL,
      replyTo: correo,
      subject: "Nuevo mensaje de contacto",
      html: `
    <h3>Nuevo mensaje desde el formulario de contacto</h3>
    <p><strong>Nombre:</strong> ${nombre}</p>
    <p><strong>Correo:</strong> ${correo}</p>
    <p><strong>Mensaje:</strong><br>Hola, quiero utilizar su app.</p>
  `,
    });

    await transporter.sendMail({
      from: `"GoAutos" <${process.env.SMTP_USER}>`,
      to: correo,
      subject: "¡Gracias por contactarnos!",
      html: `
        <h3>¡Gracias por contactarnos!</h3>
        <p>Hola ${nombre},</p>
        <p>Te agradecemos por haberte puesto en contacto con nosotros. Te avisaremos cuando la aplicación esté en funcionamiento.</p>
        <p>¡Nos pondremos en contacto contigo pronto!</p>
        <p>Saludos,<br>El equipo de GoAutos</p>
      `,
    });

    return { success: true, message: "Correo enviado correctamente" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

transporter.verify((err, success) => {
  if (err) {
    console.error("Error al verificar conexión SMTP:", err.message);
  } else {
    console.log("Conexión SMTP verificada con éxito");
  }
});

module.exports = { enviarCorreoContacto };
