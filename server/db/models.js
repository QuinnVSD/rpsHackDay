/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;
const { Schema } = mongoose;

const Player = mongoose.model('Player', playerSchema);
const PendingMove = mongoose.model('PendingMove', pendingMoveSchema);
const ActiveGame = mongoose.model('ActiveGame', activeGameSchema);
const FinishedGame = mongoose.model('FinishedGame', finishedGameSchema);

const playerSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  moves: Array,
  activeGames: [{ type: Schema.Types.ObjectId, ref: ActiveGame }],
  gameCount: Number,
  winCount: Number,
});

const pendingMoveSchema = new Schema({
  gameId: { type: Schema.Types.ObjectId, ref: ActiveGame },
  p1: String,
  p2: String,
});

const activeGameSchema = new Schema({
  _id: Schema.Types.ObjectId,
  p1: { type: Schema.Types.ObjectId, ref: Player },
  p1Score: Number,
  p2: { type: Schema.Types.ObjectId, ref: Player },
  p2Score: Number,
  scoreLimit: Number,
});

const finishedGameSchema = new Schema({
  _id: Schema.Types.ObjectId,
  p1: { type: Schema.Types.ObjectId, ref: Player },
  p2: { type: Schema.Types.ObjectId, ref: Player },
  winner: { type: Schema.Types.ObjectId, ref: Player },
});

module.exports = {
  Player,
  PendingMove,
  ActiveGame,
  FinishedGame,
};
