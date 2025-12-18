const jwt = require('jsonwebtoken');

// Generar token JWT
const generarToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' } // Token válido por 30 días
  );
};

// Verificar token JWT
const verificarToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generarToken,
  verificarToken
};