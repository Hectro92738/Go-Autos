const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretdode');
    req.user = decoded;  
    next();  
  } catch (err) {
    return res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = protect;
