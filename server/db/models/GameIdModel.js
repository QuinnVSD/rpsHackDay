const mongoose = require('mongoose');

const { Schema } = mongoose;

const GameIdSchema = new Schema({
  counter: Number,
});

module.exports = mongoose.model('gameId', GameIdSchema);
