const mongoose = require('mongoose');

const solicitudPaseadorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  nombre: {
    type: String,
  },
  dni: {
    type: String,
  },
  fotoDocumentoFrente: {
    type: String,
  },
  fotoDocumentoDorso: {
    type: String,
  },
  foto: {
    type: String,
  },
  aceptarTerminos: {
    type: Boolean,
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aprobado', 'bloqueado', 'reintentar'],
    default: 'pendiente',
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = SolicitudPaseador = mongoose.model('solicitudpaseador', solicitudPaseadorSchema);
