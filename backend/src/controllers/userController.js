const User = require("../models/user");
const Role = require("../models/role");
const jwt = require("jsonwebtoken");
const { sendVerificationCode } = require("../services/sendVerificationCode");
const EmailVerification = require("../models/emailVerification");

exports.preRegister = async (req, res) => {
  try {
    const { nombre, apellidos, email, lada, telefono } = req.body;

    if (!nombre || !apellidos || !email || !telefono || !lada) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Formato de correo inválido" });
    }

    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(telefono)) {
      return res
        .status(400)
        .json({ message: "Teléfono inválido (10 dígitos)" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { telefono }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Correo o teléfono ya están registrados" });
    }

    await sendVerificationCode({ nombre, email });

    res
      .status(200)
      .json({ message: "Código de verificación enviado al correo" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al iniciar el pre-registro" });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const record = await EmailVerification.findOne({ email });

    if (!record || record.code !== code || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Código inválido o expirado" });
    }

    record.verified = true;
    await record.save();

    res.status(200).json({ message: "Código verificado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al verificar el código" });
  }
};

exports.registerUser = async (req, res) => {
  try {
    
    const { nombre, apellidos, email, telefono, lada, password } = req.body;

    const verificationRecord = await EmailVerification.findOne({ email });

    if (!verificationRecord || !verificationRecord.verified) {
      return res
        .status(400)
        .json({
          message:
            "El correo no ha sido verificado. Por favor verifica tu correo antes de continuar.",
        });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|\\;:'",<>\./?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener al menos una mayúscula, una minúscula, un número, un carácter especial (incluyendo _), y un mínimo de 8 caracteres.",
      });
    }

    const role = await Role.findOne({ name: "cliente" });
    if (!role) {
      return res
        .status(500)
        .json({
          message:
            'Rol por defecto "cliente" no encontrado en la base de datos',
        });
    }

    const user = new User({
      nombre,
      apellidos,
      email,
      telefono,
      lada,
      rol: role._id,
      password,
    });

    await user.save();

    await EmailVerification.deleteOne({ email });

    const token = jwt.sign(
      { userId: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res
      .status(201)
      .json({ message: "Usuario registrado correctamente", user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno al registrar usuario" });
  }
};
