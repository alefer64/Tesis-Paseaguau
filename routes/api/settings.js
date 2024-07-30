const express = require('express');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const SolicitudPaseador = require('../../models/SolicitudPaseadorSchema');
const User = require('../../models/User');
const Pet = require('../../models/Pet');
const upload = require('../../multerConfig');

router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id);
    if (!profile) {
      return res.status(400).json({ msg: 'No profile found' });
    }

    if (!user.esPaseador) {
      return res.status(400).json({ msg: 'No eres paseador.' });
    }

    const maxPhotos = user.premium ? 12 : 3;
    if (profile.galeriaFotos.length >= maxPhotos) {
      return res.status(400).json({ msg: `Solo puedes subir hasta ${maxPhotos} fotos.` });
    }

    const photoUrl = req.file.path;
    profile.galeriaFotos.push(photoUrl);
    await profile.save();

    res.json({ url: photoUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/upload', auth, async (req, res) => {
  try {
    const url = req.body.url.replace(/\\/g, '\\');
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'Perfil no encontrado' });
    }

    if (!user.esPaseador) {
      return res.status(400).json({ msg: 'No eres paseador.' });
    }

    const removeIndex = profile.galeriaFotos.indexOf(url);
    if (removeIndex === -1) {
      return res.status(400).json({ msg: 'Foto no encontrada' });
    }

    profile.galeriaFotos.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/banner', auth, upload.single('banner'), async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id);

    if (!profile) return res.status(404).json({ msg: 'Perfil no encontrado' });

    if (!user.premium) {
      return res.status(400).json({ msg: 'Solo los usuarios premium pueden subir un banner.' });
    }

    if (!user.esPaseador) {
      return res.status(400).json({ msg: 'No eres paseador.' });
    }

    profile.banner = req.file.path;

    await profile.save();

    res.json({ msg: 'Banner subido exitosamente', banner: profile.banner });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Error del servidor');
  }
});

router.delete('/banner', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) return res.status(404).json({ msg: 'Perfil no encontrado' });

    if (!user.esPaseador) {
      return res.status(400).json({ msg: 'No eres paseador.' });
    }

    profile.banner = null;

    await profile.save();

    res.json({ msg: 'Banner eliminado exitosamente' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Error del servidor');
  }
});

router.get('/direccion', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('address');
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(user.address);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

router.delete('/direccion', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    user.address = null;
    await user.save();

    if (user.esPaseador) {
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile.direccion = null;
        await profile.save();
      }
    }

    res.json({ msg: 'Dirección eliminada' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

router.put('/direccion', auth, async (req, res) => {
  const { localidad, barrio, calle, pisoDpto, observacion, position } = req.body;
  const newAddress = { localidad, barrio, calle, pisoDpto, observacion, position };
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    console.log('4');

    user.address = newAddress;

    await user.save();

    if (user.esPaseador) {
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile.ubicacion = newAddress;
        await profile.save();
      }
    }

    res.json(user.address);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route       PUT api/pricing
// @desc        PUT pricing
// @access      Public
router.put('/pricing', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id);

    if (!profile) {
      return res.status(400).json({ msg: 'No profile found' });
    }

    if (!user.esPaseador) {
      return res.status(400).json({ msg: 'Usuario no es paseador' });
    }

    if (!req.body.pricePerWalk) {
      return res.status(400).json({ msg: 'Precio no puede ser vacío' });
    }

    if (req.body.pricePerWalk < 0) {
      return res.status(400).json({ msg: 'Precio no puede ser negativo' });
    }

    profile.precio = req.body.pricePerWalk;

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/horarios
// @desc    Obtener horarios del paseador
// @access  Private
router.get('/horarios', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'Perfil no encontrado' });
    }

    res.json(profile.horarios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT api/profile/horarios
// @desc    Actualizar horarios del paseador
// @access  Private
router.put('/horarios', auth, async (req, res) => {
  const { mañana, tarde, noche } = req.body;

  const horarios = {
    mañana,
    tarde,
    noche
  };

  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: { horarios } },
      { new: true, upsert: true }
    );

    res.json(profile.horarios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
