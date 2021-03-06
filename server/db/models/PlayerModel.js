const mongoose = require('mongoose');

const { Schema } = mongoose;

const PlayerSchema = new Schema({
  name: String,
  moves: Array,
  gameCount: Number,
  winCount: Number,
});

module.exports = mongoose.model('player', PlayerSchema);
