// middlewares/isAdmin.js
module.exports = function (req, res, next) {
  // Verificar si el usuario autenticado es administrador
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: 'Acceso denegado. No eres administrador.' });
  }
  next();
};
