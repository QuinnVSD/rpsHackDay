const mongoose = require('mongoose');

const { Schema } = mongoose;

const ActiveGameSchema = new Schema({
  id: Number,
  p1: String,
  p2: String,
  p1Score: Number,
  p2Score: Number,
  scoreLimit: Number,
});

module.exports = mongoose.model('activeGame', ActiveGameSchema);
