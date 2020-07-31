const mongoose = require('mongoose');

const { Schema } = mongoose;

const PendingMoveSchema = new Schema({
  gameId: Number,
  p1Move: String,
  p2Move: String,
});

module.exports = mongoose.model('pendingMove', PendingMoveSchema);
