const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const seedRoles = require('./seedRoles');

dotenv.config();

const app = express();

connectDB();
seedRoles();

app.use(cors()); 

app.use(bodyParser.json());

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api', contactRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
