const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
    localidad: {
        type: String,
        required: true,
    },
    barrio: {
        type: String,
        required: false,
    },
    calle: {
        type: String,
        required: true,
    },
    pisoDpto: {
        type: String,
        required: false,
    },
    position: {
        lat: {
            type: Number,
            required: false,
        },
        lng: {
            type: Number,
            required: false,
        },
    },
    observacion: {
        type: String,
        required: false,
    },
});

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    nombre: {
        type: String,
        required: true,
    },
    foto: {
        type: String,
    },
    titulo: {
        type: String,
        required: false,
    },
    descripcion: {
        type: String,
        required: false,
    },
    direccion: direccionSchema,
    precio: {
        type: Number,
        default: 0,
        required: true,
    },
    puntuacion: {
        type: Number,
        default: 0,
    },
    viajesFinalizados: {
        type: Number,
        default: 0,
    },
    placas: [
        {
            tipo: {
                type: String,
            },
            descripcion: {
                type: String,
            },
            fecha: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    scheduleLimit: {
        type: Number,
        default: 3,
    },
    estado: {
        type: String,
        enum: ['pendiente', 'aprobado', 'reintentar', 'bloqueado'],
        default: 'pendiente',
    },
    galeriaFotos: {
        type: [String],
    },
    banner: {
        type: String,
    },
    horarios: {
        mañana: [String],
        tarde: [String],
        noche: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = Profile = mongoose.model('profile', profileSchema);
