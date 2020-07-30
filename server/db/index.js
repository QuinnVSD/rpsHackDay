const { MongoClient, ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const PlayerModel = require('./models/PlayerModel');
const ActiveGameModel = require('./models/ActiveGameModel');
const FinishedGameModel = require('./models/FinishedGameModel');
const PendingMoveModel = require('./models/PendingMoveModel');

// const { db } = mongoose.connection;

// const url = 'mongodb://saltadmin:episalt@localhost/saltreviews';

// mongoose.connect(url, { useNewUrlParser: true });

async function clearAllTables(callback) {
  await PlayerModel.deleteMany({}, () => { console.log ('all player data removed'); });
  await ActiveGameModel.deleteMany({}, () => { console.log ('all active games removed'); });
  await FinishedGameModel.deleteMany({}, () => { console.log ('all finished games removed'); });
  await PendingMoveModel.deleteMany({}, () => { console.log ('all pending moves removed'); });
  callback();
}

function getAllPlayers(callback) {
  PlayerModel.find({})
    .lean()
    .exec((err, players) => {
      if (err) {
        throw new Error('500 failed to execute player lookup');
      }
      if (!players) {
        throw new Error('404 player doesnt exist');
      }
      console.log('players');
      callback(players);
    });
}

function getPlayerByName(name, callback) {
  PlayerModel.findOne({ name }, (err, player) => {
    if (err) {
      throw new Error('500 failed to execute player lookup');
    }
    if (!player) {
      throw new Error('404 player doesnt exist');
    }
    callback(player);
  });
}

function createPlayer(name, callback) {
  const player = new PlayerModel({
    name,
    moves: [],
    gameCount: 0,
    winCount: 0,
  });
  player.save((err) => {
    if (err) {
      throw new Error('500 failed to execute player lookup');
    }
    callback();
  });
}

module.exports = {
  clearAllTables,
  getAllPlayers,
  getPlayerByName,
  createPlayer,
};
