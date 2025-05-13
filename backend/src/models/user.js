const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellidos: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Formato de correo inválido']
  },
  lada: {
    type: String,
    required: true,
    trim: true,
    match: [/^\+\d{1,4}$/, 'Formato de lada inválido']
  },
  telefono: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'El teléfono debe tener exactamente 10 dígitos numéricos']
  },
  rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  password: { type: String, required: true }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
