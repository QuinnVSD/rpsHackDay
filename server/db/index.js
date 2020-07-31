/* eslint-disable no-console */

const PlayerModel = require('./models/PlayerModel');
const ActiveGameModel = require('./models/ActiveGameModel');
const FinishedGameModel = require('./models/FinishedGameModel');
const PendingMoveModel = require('./models/PendingMoveModel');
const GameIdModel = require('./models/GameIdModel');
const { db } = require('./models/PlayerModel');

async function clearAllTables(callback) {
  await PlayerModel.deleteMany({}, () => { console.log('all player data removed'); });
  await ActiveGameModel.deleteMany({}, () => { console.log('all active games removed'); });
  await FinishedGameModel.deleteMany({}, () => { console.log('all finished games removed'); });
  await PendingMoveModel.deleteMany({}, () => { console.log('all pending moves removed'); });
  await GameIdModel.deleteMany({}, () => { console.log('game ID counter deleted'); });
  const gameIdCounter = new GameIdModel({
    counter: 0,
  });
  await gameIdCounter.save();
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
  const id = await (await GameIdModel.findOne({})).get('counter');
  const game = new ActiveGameModel({
    id,
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

function getActiveGameById(gId, callback) {
  ActiveGameModel.findOne({ _id: gId }, (err, game) => {
    if (err) {
      throw new Error('500 failed to execute game lookup');
    }
    if (!game) {
      throw new Error('404 game doesnt exist');
    }
    callback(game);
  });
}
function findResultById(id, callback) {
  return true;
}

module.exports = {
  clearAllTables,
  getAllPlayers,
  getPlayerByName,
  createPlayer,
  addActiveGame,
  getAllActiveGames,
  getGamesOfPlayer,
  findResultById,
  getActiveGameById,
};
