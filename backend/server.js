const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = 3000; // Cambia si usas otro puerto

// Twilio credentials
const accountSid = 'ACa6a77355cc8fbd77630f47066a1543d1';
const authToken = 'dfcbc12e648b3b04f1925fb8ac14f494';
const client = new twilio(accountSid, authToken);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta para iniciar la verificación de SMS
app.post('/api/start-verification', async (req, res) => {
  const { to } = req.body; // El número al que enviar el código
  try {
    const verification = await client.verify.services('VA7dd4d24f82cc7ce4b68e45f21d51547b') 
      .verifications
      .create({
        to: to,
        channel: 'sms' 
      });

    res.json({ success: true, sid: verification.sid });
  } catch (error) {
    console.error('Error al iniciar verificación:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para verificar el código ingresado por el usuario
app.post('/api/verify-code', async (req, res) => {
  const { to, code } = req.body;

  try {
    const verificationCheck = await client.verify.services('VA7dd4d24f82cc7ce4b68e45f21d51547b') 
      .verificationChecks
      .create({
        to: to,
        code: code
      });

    if (verificationCheck.status === 'approved') {
      res.json({ success: true, message: 'Número verificado exitosamente' });
    } else {
      res.json({ success: false, message: 'Código incorrecto o expirado' });
    }
  } catch (error) {
    console.error('Error al verificar el código:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
