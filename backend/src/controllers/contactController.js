// controllers/contactController.js
const { enviarCorreoContacto } = require('../services/emailService');

async function handleFormularioContacto(req, res) {
  const { nombre, correo} = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
  }

  const result = await enviarCorreoContacto(nombre, correo);

  if (result.success) {
    return res.status(200).json({ success: true, message: result.message });
  } else {
    return res.status(500).json({ success: false, message: result.message });
  }
}

module.exports = { handleFormularioContacto };
