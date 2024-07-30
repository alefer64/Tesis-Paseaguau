const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const SolicitudPaseador = require('../../models/SolicitudPaseadorSchema');
const User = require('../../models/User');
const Pet = require('../../models/Pet');
const upload = require('../../multerConfig');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'premium']);

    if (!profile) {
      return res.status(400).json({ msg: 'No tienes un perfil' });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route       GET api/profile
// @desc        Get all profiles
// @access      Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar', 'premium']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.params.user_id
    });

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route       DELETE api/profile
// @desc        Delete profile, user &
// @access      Private
router.delete('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile does not exists' });
    }

    await User.findOneAndRemove({ _id: req.user.id });
    await Profile.findOneAndRemove({ user: req.user.id });
    await SolicitudPaseador.findOneAndRemove({ user: req.user.id });

    await Pet.findOneAndRemove({ user: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route       PUT api/profile/update
// @desc        Update walker profile information
// @access      Private
router.put('/update', auth, async (req, res) => {
  const {
    titulo,
    descripcion,
    perrosPorPaseo,
    tamanoPerros
  } = req.body;

  const profileFields = {};
  if (titulo) profileFields.titulo = titulo;
  if (descripcion) profileFields.descripcion = descripcion;
  if (perrosPorPaseo) profileFields.perrosPorPaseo = perrosPorPaseo;
  if (tamanoPerros) profileFields.tamanoPerros = tamanoPerros.split(',');
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    let user = await User.findById(req.user.id);

    if (!user.esPaseador) {
      return res.status(400).json({ msg: 'No eres paseador.' });
    }

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    } else {
      return res.status(400).json({ msg: 'Profile not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/search
// @desc    Get profiles by locality and prioritize premium users
// @access  Public
router.get('/search', async (req, res) => {
  const { localidad } = req.query;
  try {
    if (!localidad) {
      return res.status(400).json({ msg: 'Localidad es requerida' });
    }

    let profiles = await Profile.find({ 'direccion.localidad': localidad, 'precio': { $ne: undefined } }).populate('user', ['name', 'avatar', 'premium']);

    if (profiles.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron paseadores en esa localidad' });
    }

    profiles = profiles.sort((a, b) => b.user.premium - a.user.premium);

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

module.exports = router;
