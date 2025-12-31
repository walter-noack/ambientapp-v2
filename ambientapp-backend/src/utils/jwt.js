const jwt = require('jsonwebtoken');

const generarToken = (id, sessionId = null) => {  // 👈 acepta sessionId opcional
  const payload = { id };
  if (sessionId) {
    payload.sessionId = sessionId;  // 👈 incluir en el token
  }

  console.log('JWT payload generado:', payload); // 👈 DEBUG
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const verificarToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generarToken, verificarToken };