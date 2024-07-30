const mongoose = require('mongoose');
const TransactionSchema = require('./TransactionSchema');

const PetSchema = new mongoose.Schema({
  image: {
    type: String
  },
  name: {
    type: String,
    required: true,
    maxlength: 20
  },
  breed: {
    type: String,
    required: true,
    maxlength: 30
  },
  size: {
    type: String,
    enum: ['Pequeño', 'Mediano', 'Grande'],
    required: true
  },
  sex: {
    type: String,
    enum: ['Macho', 'Hembra'],
    required: true
  },
  ageNumber: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  ageUnit: {
    type: String,
    enum: ['Años', 'Meses'],
    required: true
  },
  observations: {
    type: String,
    required: true,
    maxlength: 200
  }
});

const addressSchema = new mongoose.Schema({
  localidad: {
    type: String,
    required: true
  },
  barrio: {
    type: String,
    required: false
  },
  calle: {
    type: String,
    required: true
  },
  pisoDpto: {
    type: String,
    required: false
  },
  position: {
    lat: {
      type: Number,
      required: false
    },
    lng: {
      type: Number,
      required: false
    }
  },
  observacion: {
    type: String,
    required: false
  }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  saldo: {
    type: Number,
    default: 0
  },
  historialTransacciones: [TransactionSchema.schema],
  dni: {
    type: String
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: addressSchema,
    required: false
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  esPaseador: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profile',
    required: false
  },
  documents: {
    dni: {
      type: Number
    },
    documentoFrente: {
      type: String
    },
    documentoDorso: {
      type: String
    }
  },
  pets: [PetSchema],
  premium: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpiration: {
    type: Date
  }
});

module.exports = User = mongoose.model('user', UserSchema);
