const express = require('express');
const upload = require('../../multerConfig');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET /api/pets
// @desc    Obtener las mascotas del usuario actual
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const usuario = await User.findById(req.user.id);

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json(usuario.pets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   POST /api/pets/newpet
// @desc    Agregar una nueva mascota al perfil del usuario
// @access  Private
router.post('/newpet', auth, upload.single('photo'), async (req, res) => {
  try {
    const { name, breed, size, sex, ageNumber, ageUnit, observations } = req.body;
    const photo = req.file ? req.file.path : '';

    const usuario = await User.findById(req.user.id);

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const nuevaMascota = {
      image: photo,
      name,
      breed,
      size,
      sex,
      ageNumber,
      ageUnit,
      observations
    };

    usuario.pets.push(nuevaMascota);
    await usuario.save();

    res.json(nuevaMascota);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   DELETE /api/pets/:petId
// @desc    Eliminar una mascota del perfil del usuario
// @access  Private
router.delete('/:petId', auth, async (req, res) => {
  try {
    const { petId } = req.params;

    const usuario = await User.findById(req.user.id);

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const mascotaIndex = usuario.pets.findIndex(mascota => mascota._id.toString() === petId);

    if (mascotaIndex === -1) {
      return res.status(404).json({ msg: 'Mascota no encontrada' });
    }

    usuario.pets.splice(mascotaIndex, 1);
    await usuario.save();

    res.json({ msg: 'Mascota eliminada exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT /api/pets/:petId
// @desc    Editar una mascota
// @access  Private
router.put('/:petId', auth, upload.single('photo'), async (req, res) => {
  const { name, breed, size, sex, ageNumber, ageUnit, observations } = req.body;
  const petFields = { name, breed, size, sex, ageNumber, ageUnit, observations };
  const { petId } = req.params;

  if (req.file) {
    petFields.image = req.file.path;
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const petIndex = user.pets.findIndex(pet => pet._id.toString() === petId);

    if (petIndex === -1) {
      return res.status(404).json({ msg: 'Mascota no encontrada' });
    }

    user.pets[petIndex] = { ...user.pets[petIndex]._doc, ...petFields };

    await user.save();

    res.json(user.pets[petIndex]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
