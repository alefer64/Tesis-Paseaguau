const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const auth = require('../../middleware/auth');
const Pet = require('../../models/Pet');
const User = require('../../models/User');
const { v4: uuidv4 } = require('uuid');
const upload = require('../../multerConfig');

const transporter = nodemailer.createTransport({
  host: process.env.nodemailer_host,
  port: process.env.nodemailer_port,
  secure: true,
  auth: {
    user: process.env.nodemailer_user,
    pass: process.env.nodemailer_pass
  }
});

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email')
      .isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('phoneNumber', 'Phone number is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phoneNumber } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password,
        phoneNumber
      });
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        });

      const mensaje = await transporter.sendMail({
        from: '',
        to: req.body.email,
        subject: 'Confirmación de Registro ',
        html: `
        <p>¡Gracias por registrarte ${req.body.name}! Por favor, haz clic <a href='${process.env.REACT_APP_API_URL}users/confirmar/${user._id}'>aquí</a> para confirmar tu registro.</p>`
      });

    } catch (err) {
      res.status(500).send('Server Error');
    }
  });


router.post('/changepassword', auth, [
  check('passwordActual', 'La contraseña actual es requerida').not().isEmpty(),
  check('nuevaContrasena', 'Por favor, ingrese una nueva contraseña con al menos 6 caracteres').isLength({ min: 6 }),
  check('confirmarContrasena', 'La confirmación de la contraseña es requerida').not().isEmpty()
], async (req, res) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { passwordActual, nuevaContrasena, confirmarContrasena } = req.body;
    const usuario = await User.findById(req.user.id);

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(passwordActual, usuario.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'La contraseña actual es inválida' });
    }

    if (nuevaContrasena !== confirmarContrasena) {
      return res.status(400).json({ msg: 'Las contraseñas no coinciden' });
    }

    if (nuevaContrasena.length < 6) {
      return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(nuevaContrasena, salt);

    usuario.password = newPassword;
    await usuario.save();

    const mensaje = await transporter.sendMail({
      from: '',
      to: usuario.email,
      subject: 'Confirmación de Cambio de Contraseña',
      html: '<p>Tu contraseña ha sido cambiada exitosamente.</p>'
    });

    res.json({ msg: 'Contraseña cambiada con éxito' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/users
// @desc    Confirm user
// @access  Public
router.get('/confirmar/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'El parámetro userId es requerido.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    if (user.verified) {
      return res.status(400).json({ error: 'El usuario ya está verificado.' });
    }

    await User.findByIdAndUpdate(userId, { verified: true });

    res.redirect(process.env.REACT_APP_CLIENT_URL + 'dashboard')
  } catch (error) {
    console.error(error);
    res.redirect(process.env.REACT_APP_CLIENT_URL + 'login');
  }
});

router.post('/reenviarconfirmacion/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'El parámetro userId es requerido.' });
    }

    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para pedir un mail a otro usuario' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    if (user.verified) {
      return res.status(400).json({ error: 'El usuario ya está verificado.' });
    }

    const mensaje = await transporter.sendMail({
      from: '',
      to: user.email,
      subject: 'Confirmación de Registro ',
      html: `<p>¡Gracias por registrarte! Por favor, haz clic <a href='${process.env.REACT_APP_API_URL}users/confirmar/${user._id}'>aquí</a> para confirmar tu registro.</p>`
    });

    res.json({ mensaje: 'Mensaje de confirmación reenviado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al reenviar el mensaje de confirmación.' });
  }
});

router.post('/request', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const resetToken = uuidv4();

    const resetTokenExpiration = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiration = resetTokenExpiration;

    await user.save();

    const resetPasswordLink = `${process.env.REACT_APP_CLIENT_URL}reset-password/${resetToken}`;

    const mensaje = await transporter.sendMail({
      from: '',
      to: user.email,
      subject: 'Recuperación de Contraseña',
      html: `<p>Haz clic <a href='${resetPasswordLink}'>aquí</a> para restablecer tu contraseña.</p>`
    });

    res.json({ mensaje: 'Se ha enviado un correo de recuperación de contraseña si el correo existe.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar el correo de recuperación de contraseña.' });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const { token, newPassword, confirmNewPassword } = req.body;
    if (!token || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiration: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido o vencido.' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiration = undefined;

    await user.save();

    res.json({ mensaje: 'Contraseña restablecida con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al restablecer la contraseña.' });
  }
});

router.get('/verify-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'El token es requerido.' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiration: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido o vencido.' });
    }

    res.json({ valid: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar el token.' });
  }
});

// @route   PUT api/users
// @desc    Update user profile
// @access  Private
router.put('/t', auth, upload.single('foto'), async (req, res) => {
  const {
    name,
    phoneType,
    phoneNumber
  } = req.body;

  const userFields = {};
  if (name) userFields.name = name;
  if (phoneType) userFields.phoneType = phoneType;
  if (phoneNumber) userFields.phoneNumber = phoneNumber;
  if (req.file) userFields.foto = req.file.path; // Guarda la ruta del archivo subido

  try {
    let user = await User.findById(req.user.id);
    let profile = await Profile.findOne({ user: req.user.id });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    );

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: userFields },
        { new: true }
      );
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
