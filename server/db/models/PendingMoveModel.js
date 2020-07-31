const mongoose = require('mongoose');

const { Schema } = mongoose;

const PendingMoveSchema = new Schema({
  id: Number,
  p1: String,
  p2: String,
});

module.exports = mongoose.model('pendingMove', PendingMoveSchema);
