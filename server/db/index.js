/* eslint-disable no-console */

const PlayerModel = require('./models/PlayerModel');
const ActiveGameModel = require('./models/ActiveGameModel');
const FinishedGameModel = require('./models/FinishedGameModel');
const PendingMoveModel = require('./models/PendingMoveModel');

async function clearAllTables(callback) {
  await PlayerModel.deleteMany({}, () => { console.log('all player data removed'); });
  await ActiveGameModel.deleteMany({}, () => { console.log('all active games removed'); });
  await FinishedGameModel.deleteMany({}, () => { console.log('all finished games removed'); });
  await PendingMoveModel.deleteMany({}, () => { console.log('all pending moves removed'); });
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

async function addActiveGame(p1, p2, maxScore, callback) {
  const p1Object = await (await PlayerModel.findOne({ name: p1 })).get('_id');
  const p2Object = await (await PlayerModel.findOne({ name: p2 })).get('_id');
  console.log(p1Object);
  const game = new ActiveGameModel({
    p1,
    p2,
    p1Score: 0,
    p2Score: 0,
    scoreLimit: 3,
  });
  game.save((err) => {
    if (err) {
      throw new Error('500 failed to execute adding game');
    }
    callback();
  });
}

function getAllActiveGames(callback) {
  ActiveGameModel.find({})
    .lean()
    .exec((err, games) => {
      if (err) {
        throw new Error('500 failed to execute player lookup');
      }
      if (!games) {
        throw new Error('404 player doesnt exist');
      }
      console.log('games');
      callback(games);
    });
}

async function getGamesOfPlayer(player, callback) {
  const games = [];
  await ActiveGameModel.find({ p1: player })
    .exec((err, g) => {
      if (err) {
        throw new Error('500 failed to execute player lookup');
      }
      if (!g) {
        throw new Error('404 player doesnt exist');
      }
      g.forEach((item) => games.push(item));
    });
  await ActiveGameModel.find({ p2: player })
    .exec((err, g) => {
      if (err) {
        throw new Error('500 failed to execute player lookup');
      }
      if (!g) {
        throw new Error('404 player doesnt exist');
      }
      g.forEach((item) => games.push(item));
    });
  setTimeout(() => { callback(games); }, 200);
}

module.exports = {
  clearAllTables,
  getAllPlayers,
  getPlayerByName,
  createPlayer,
  addActiveGame,
  getAllActiveGames,
  getGamesOfPlayer,
};
