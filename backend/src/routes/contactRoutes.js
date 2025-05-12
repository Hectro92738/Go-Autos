// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { handleFormularioContacto } = require('../controllers/contactController');

router.post('/contacto', handleFormularioContacto);

module.exports = router;
