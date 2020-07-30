const mongoose = require('mongoose');

const { Schema } = mongoose;

const PlayerSchema = new Schema({
  id: Number,
  name: String,
  moves: Array,
  gameCount: Number,
  winCount: Number,
});

module.exports = mongoose.model('player', PlayerSchema);
