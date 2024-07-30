const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit', 'subscription'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed', 'cancelled', 'refused'],
    default: 'pending',
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('transaction', TransactionSchema);
