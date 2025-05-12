const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');

dotenv.config();

const app = express();

app.use(cors()); 

app.use(bodyParser.json());
app.use('/api', contactRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
