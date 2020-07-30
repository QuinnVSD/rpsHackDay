const mongoose = require('mongoose');

const { Schema } = mongoose;

const FinishedGameSchema = new Schema({
  id: Number,
  p1: {
    type: Schema.Types.ObjectId,
    ref: 'player',
  },
  p2: {
    type: Schema.Types.ObjectId,
    ref: 'player',
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'player',
  },
});

module.exports = mongoose.model('finishedGame', FinishedGameSchema);
