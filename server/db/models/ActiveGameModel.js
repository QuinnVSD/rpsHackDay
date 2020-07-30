const mongoose = require('mongoose');

const { Schema } = mongoose;

const ActiveGameSchema = new Schema({
  id: Number,
  p1: {
    type: Schema.Types.ObjectId,
    ref: 'player',
  },
  p2: {
    type: Schema.Types.ObjectId,
    ref: 'player',
  },
  p1Score: Number,
  p2Score: Number,
  scoreLimit: Number,
});

module.exports = mongoose.model('activeGame', ActiveGameSchema);
