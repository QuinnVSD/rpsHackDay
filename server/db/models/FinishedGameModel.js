const mongoose = require('mongoose');

const { Schema } = mongoose;

const FinishedGameSchema = new Schema({
  id: Number,
  p1: String,
  p2: String,
  winner: String,
});

module.exports = mongoose.model('finishedGame', FinishedGameSchema);
