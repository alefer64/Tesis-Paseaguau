require('dotenv').config();
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const SolicitudPaseador = require('../../models/SolicitudPaseadorSchema');
const upload = require('../../multerConfig');
const User = require('../../models/User');
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.nodemailer_host,
  port: process.env.nodemailer_port,
  secure: true,
  auth: {
    user: process.env.nodemailer_user,
    pass: process.env.nodemailer_pass
  }
});

// @route   GET /api/solicitudes-pendientes
// @desc    Obtener todas las solicitudes pendientes
// @access  Private (solo para administradores)
router.get('/solicitudes-pendientes', auth, async (req, res) => {
  try {
    const usuario = await User.findById(req.user.id);

    if (!usuario.isAdmin) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    const solicitudesPendientes = await SolicitudPaseador.find({ estado: 'pendiente' });

    res.json(solicitudesPendientes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   POST /api/solicitudes-paseador/nueva-solicitud
// @desc    Crear una nueva solicitud de paseador
// @access  Private
router.post('/nueva-solicitud', auth, upload.fields([
  { name: 'documentoFrente', maxCount: 1 },
  { name: 'documentoDorso', maxCount: 1 }
]), async (req, res) => {
  try {
    const { dni, tipoDocumento, aceptarTerminos } = req.body;
    const usuario = await User.findById(req.user.id);
    let solicitudUsuario = await SolicitudPaseador.findOne({ user: req.user.id });

    if (solicitudUsuario && solicitudUsuario.estado === 'pendiente') {
      return res.status(400).json({ msg: 'Ya tienes una solicitud pendiente' });
    }

    if (solicitudUsuario && solicitudUsuario.estado === 'bloqueado') {
      return res.status(400).json({ msg: 'Tu solicitud ha sido bloqueada' });
    }

    if (solicitudUsuario && solicitudUsuario.estado === 'aprobado') {
      return res.status(400).json({ msg: 'Ya eres un paseador' });
    }

    if (!aceptarTerminos) {
      return res.status(400).json({ msg: 'Debes aceptar los términos y condiciones.' });
    }

    if (!req.files['documentoFrente'] || !req.files['documentoDorso']) {
      return res.status(400).json({ msg: 'Ambas imágenes del documento son requeridas' });
    }

    const documentoFrenteUrl = req.files['documentoFrente'][0].path;
    const documentoDorsoUrl = req.files['documentoDorso'][0].path;

    if (!solicitudUsuario) {
      solicitudUsuario = new SolicitudPaseador({
        user: req.user.id,
        nombre: usuario.name,
        dni: dni,
        tipoDocumento: tipoDocumento,
        fotoDocumentoFrente: documentoFrenteUrl,
        fotoDocumentoDorso: documentoDorsoUrl,
        estado: 'pendiente'
      });
    } else {
      solicitudUsuario.dni = dni;
      solicitudUsuario.tipoDocumento = tipoDocumento;
      solicitudUsuario.fotoDocumentoFrente = documentoFrenteUrl;
      solicitudUsuario.fotoDocumentoDorso = documentoDorsoUrl;
      solicitudUsuario.estado = 'pendiente';
    }

    await solicitudUsuario.save();
    res.json({ msg: 'Solicitud de paseador creada o actualizada con éxito' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT /api/solicitudes/reintentar-solicitud/:id
// @desc    Reintentar una solicitud de paseador por ID
// @access  Private
router.put('/reintentar-solicitud/:id', auth, async (req, res) => {
  try {
    const solicitud = await SolicitudPaseador.findById(req.params.id);

    if (!solicitud) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' });
    }

    const usuario = await User.findById(solicitud.user);

    try {
      const fotoDocumentoFrentePath = path.join(__dirname, '..', solicitud.fotoDocumentoFrente);
      const fotoDocumentoDorsoPath = path.join(__dirname, '..', solicitud.fotoDocumentoDorso);

      if (await fs.access(fotoDocumentoFrentePath).then(() => true).catch(() => false)) {
        await fs.unlink(fotoDocumentoFrentePath);
      }

      if (await fs.access(fotoDocumentoDorsoPath).then(() => true).catch(() => false)) {
        await fs.unlink(fotoDocumentoDorsoPath);
      }
    } catch (err) {
      console.error('Error al eliminar las imágenes:', err.message);
    }

    const mensaje = await transporter.sendMail({
      from: '',
      to: usuario.email,
      subject: 'Solicitud de Paseador - Reintento Requerido',
      html: `<p>Hola ${usuario.name},</p>
             <p>Tu solicitud de paseador ha sido rechazada por la siguiente razón: ${req.body.razon}</p>
             <p>Por favor, vuelve a enviar tu solicitud con los documentos correctos.</p>`
    });

    await SolicitudPaseador.deleteOne({ _id: solicitud._id });

    res.json({ msg: 'Solicitud eliminada y correo enviado con éxito' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});


// @route GET /api/solicitudes-paseador/mis-solicitudes
// @desc Obtener todas las solicitudes de un usuario específico
// @access Private
router.get('/mi-solicitud', auth, async (req, res) => {
  try {
    // Obtener todas las solicitudes del usuario actual
    const misSolicitudes = await SolicitudPaseador.find({ user: req.user.id });

    res.json(misSolicitudes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   DELETE /api/solicitudes-paseador/eliminar-solicitud/:id
// @desc    Eliminar una solicitud de paseador por ID
// @access  Private
router.delete('/eliminar-solicitud/:id', auth, async (req, res) => {
  try {
    const solicitud = await SolicitudPaseador.findById(req.params.id);

    if (!solicitud) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' });
    }

    try {
      const fotoDocumentoFrentePath = path.join(__dirname, '..', solicitud.fotoDocumentoFrente);
      const fotoDocumentoDorsoPath = path.join(__dirname, '..', solicitud.fotoDocumentoDorso);

      if (await fs.access(fotoDocumentoFrentePath).then(() => true).catch(() => false)) {
        await fs.unlink(fotoDocumentoFrentePath);
      }

      if (await fs.access(fotoDocumentoDorsoPath).then(() => true).catch(() => false)) {
        await fs.unlink(fotoDocumentoDorsoPath);
      }
    } catch (err) {
      console.error('Error al eliminar las imágenes:', err.message);
    }

    await SolicitudPaseador.deleteOne({ _id: solicitud._id });

    const usuario = await User.findById(solicitud.user);
    usuario.solicitudPaseador = 'noSolicitado';
    await usuario.save();

    res.json({ msg: 'Solicitud eliminada con éxito' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT /api/solicitudes-paseador/bloquear-solicitud/:id
// @desc    Bloquear una solicitud de paseador por ID
// @access  Private
router.put('/bloquear-solicitud/:id', auth, async (req, res) => {
  try {
    const solicitud = await SolicitudPaseador.findById(req.params.id);

    // Verificar si la solicitud existe
    if (!solicitud) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' });
    }

    const usuario = await User.findById(solicitud.user);

    // Eliminar las imágenes asociadas a la solicitud del disco
    try {
      const fotoDocumentoFrentePath = path.join(__dirname, '..', solicitud.fotoDocumentoFrente);
      const fotoDocumentoDorsoPath = path.join(__dirname, '..', solicitud.fotoDocumentoDorso);

      if (await fs.access(fotoDocumentoFrentePath).then(() => true).catch(() => false)) {
        await fs.unlink(fotoDocumentoFrentePath);
      }

      if (await fs.access(fotoDocumentoDorsoPath).then(() => true).catch(() => false)) {
        await fs.unlink(fotoDocumentoDorsoPath);
      }
    } catch (err) {
      console.error('Error al eliminar las imágenes:', err.message);
    }

    // Enviar correo electrónico al usuario
    const mensaje = await transporter.sendMail({
      from: '',
      to: usuario.email,
      subject: 'Solicitud de Paseador - Bloqueada',
      html: `<p>Hola ${usuario.name},</p>
             <p>Tu solicitud de paseador ha sido bloqueada por la siguiente razón: ${req.body.razon}</p>
             <p>Por favor, contacta con soporte si necesitas más información.</p>`
    });

    solicitud.estado = 'bloqueado';
    await solicitud.save();

    res.json({ msg: 'Solicitud bloqueada y correo enviado con éxito' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT /api/solicitudes-paseador/aprobar-solicitud/:id
// @desc    Aprobar una solicitud de paseador por ID
// @access  Private
router.put('/aprobar-solicitud/:id', auth, async (req, res) => {
  try {
    const solicitud = await SolicitudPaseador.findById(req.params.id);
    const usuario = await User.findById(solicitud.user);

    // Verificar si la solicitud existe
    if (!solicitud) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' });
    }

    // Actualiza el estado de la solicitud a "aprobado"
    solicitud.estado = 'aprobado';

    usuario.esPaseador = true;
    usuario.dni = solicitud.dni;
    usuario.avatar = solicitud.foto;
    usuario.documents = {
      dni: solicitud.dni,
      documentoFrente: solicitud.fotoDocumentoFrente,
      documentoDorso: solicitud.fotoDocumentoDorso
    };

    // Guarda la solicitud actualizada en la base de datos
    await solicitud.save();
    await usuario.save();

    // Crea un nuevo perfil utilizando los datos de la solicitud y el usuario
    const nuevoPerfil = new Profile({
      user: usuario._id,
      nombre: usuario.name, // Puedes tomar el nombre del usuario
      titulo: 'Título',
      descripcion: 'Descripción',
      ubicacion: 'Ubicación',
    });

    await nuevoPerfil.save();
    // Conecta el perfil creado al usuario
    usuario.profile = nuevoPerfil._id;
    await usuario.save();

    res.json({ msg: 'Solicitud aprobada con éxito' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
