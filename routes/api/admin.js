const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin');
const User = require('../models/User');

router.get('/solicitudes-pendientes', isAdmin, async (req, res) => {
  try {
    const solicitudesPendientes = await User.find({ solicitudPaseador: 'pendiente' });
    res.json(solicitudesPendientes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

router.put('/aprobar-solicitud/:userId', isAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user || user.solicitudPaseador !== 'pendiente') {
      return res.status(404).json({ msg: 'Usuario no encontrado o no tiene una solicitud pendiente.' });
    }

    user.solicitudPaseador = 'aprobado';
    await user.save();

    res.json({ msg: 'Solicitud de paseador aprobada con éxito.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

router.put('/ban/:id', isAdmin, async (req, res) => {
  try {
    const userToBan = await User.findById(req.params.id);

    if (!userToBan) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    userToBan.isBanned = !userToBan.isBanned;

    await userToBan.save();
    res.json({ msg: `Usuario ${userToBan.isBanned ? 'prohibido' : 'desbloqueado'} con éxito` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
