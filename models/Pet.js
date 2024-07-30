const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PetSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  image: {
    type: String
  },
  name: {
    type: String,
    required: true,
    maxlength: 20,
  },
  breed: {
    type: String,
    required: true,
    maxlength: 30,
  },
  size: {
    type: String,
    enum: ['Pequeño', 'Mediano', 'Grande'],
    required: true,
  },
  sex: {
    type: String,
    enum: ['Macho', 'Hembra'],
    required: true,
  },
  ageNumber: {
    type: Number,
    required: true,
    min: 0,
    max: 20,
  },
  ageUnit: {
    type: String,
    enum: ['Años', 'Meses'],
    required: true,
  },
  observations: {
    type: String,
    required: true,
    maxlength: 200,
  }
});

module.exports = Pet = mongoose.model('pet', PetSchema);
