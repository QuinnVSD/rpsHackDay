/* eslint-disable no-console */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

mongoose.Promise = global.Promise;

const db = require('./db');

const url = 'mongodb://saltadmin:episalt@localhost/saltreviews';

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

mongoose.connect(url, { useNewUrlParser: true });
const { connection } = mongoose;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function errInexistentResult() {
  const err = new Error('There is no completed game with that ID');
  err.status = 404;
  return err;
}

function errWrongGame() {
  const err = new Error('That game is either inactive, or you do not have access to it!');
  err.status = 404;
  return err;
}

function checkP1BeatsP2(moveP1, moveP2) {
  if ((moveP1 === 'R' && moveP2 === 'S')
    || (moveP1 === 'S' && moveP2 === 'P')
    || (moveP1 === 'P' && moveP2 === 'R')) {
    return true;
  }
  return false;
}

// NEEDS FIXING
function checkUserInGame(game, uId) {
  return (game.p1.name === uId || game.p2.name === uId);
}
// I dunno, "hello" page
app.get('/', (req, res) => {
  if (req.session.loggedin) {
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

// post request to the base / route clears the databases
app.post('/', async (req, res) => {
  await db.clearAllTables(() => {
    res.status(204)
      .send();
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

// welcomes a logged in user
app.get('/home', (req, res) => {
  if (req.session.loggedin) {
    res.render('home', { name: req.session.username });
  } else {
    res.redirect('/login');
  }
});

app.post('/auth', async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (password === 'secret') {
      req.session.loggedin = true;
      req.session.username = username;
      if (await !db.getPlayerByName(username, () => {
        db.createPlayer(username, () => { });
      }));
      res.redirect('/home');
    } else {
      res.send('Incorrect Username and/or Password!');
    }
    res.end();
  } else {
    res.send('Please enter Username and Password!');
    res.end();
  }
});

// returns list of all players
app.get('/players', async (req, res, next) => {
  await db.getAllPlayers((players) => {
    res.status(200)
      .json(players);
  });
});

// returns single player
app.get('/players/:username', async (req, res, next) => {
  const { username } = req.params;
  try {
    await db.getPlayerByName(username, (player) => {
      res.status(200)
        .json(player);
    });
  } catch (e) {
    next(e);
  }
});

// creates new player
app.post('/players/:username', async (req, res, next) => {
  const { username } = req.params;
  try {
    await db.createPlayer(username, () => {
      res.status(201)
        .send();
    });
  } catch (e) {
    next(e);
  }
});

// responds with list of all active games
app.get('/games', async (req, res, next) => {
  await db.getAllActiveGames((games) => {
    res.status(200)
      .json(games);
  });
});

// responds of list of all active games that a player is in
app.get('/games/:player', async (req, res, next) => {
  const { player } = req.params;
  await db.getGamesOfPlayer(player, (games) => {
    res.status(200)
      .json(games);
  });
});

// accepts 2 player names in the body to start a new game between them
app.post('/games', async (req, res, next) => {
  const { p1, p2 } = req.body;
  await db.addActiveGame(p1, p2, 2, () => {
    res.status(201)
      .send();
  });
});

app.get('/results/:gId', async (req, res, next) => {
  const { gId } = req.params;
  const game = await db.findResultById(gId);
  if (game) {
    res.status(200)
      .json(game);
  } else {
    next(errInexistentResult());
  }
});

app.get('/games/:gId/:uId', async (req, res, next) => {
  const { gId, uId } = req.params;
  const game = await db.findActiveGame(gId);
  if (game !== undefined && checkUserInGame(game, uId)) {
    res.status(200)
      .json(game);
  } else {
    next(errWrongGame());
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message || 'Non-specific server error',
  });
  next();
});

module.exports = app;

// function performGameCompletion() {
//   return true;
// }
// function performRoundCompletion(game) {
//   const moveStorage = secretMoves.find((g) => g.id === game.id);
//   const p1Move = moveStorage.p1;
//   const p2Move = moveStorage.p2;
//   game.p1.moves.push(moveStorage.p1);
//   game.p2.moves.push(moveStorage.p2);
//   moveStorage.p1 = null;
//   moveStorage.p2 = null;
//   if (p1Move === p2Move) {
//     return;
//   }
//   const winner = checkP1BeatsP2(p1Move, p2Move) ? 'p1' : 'p2';
//   const loser = winner === 'p1' ? 'p2' : p1;
//   game[winner].score += 1;
//   if (game[winner].score === game.scoreLimit) {
//     performGameCompletion(game);
//   }
// }

// // submits move AND RETURNS boolean representing round completion (to prevent double db access)
// function submitMove(game, uId, move) {
//   const activePlayer = game.p1.name === uId ? 'p1' : 'p2';
//   const storedMove = secretMoves.find((g) => g.gameId === game.id)[activePlayer];
//   if (storedMove) throw new Error('No move expected from that user');
//   secretMoves[activePlayer] = move;
//   if (secretMoves.p1 && secretMoves.p2) return true;
//   return false;
// }

// app.get('/game/:gId/:uId', async (req, res, next) => {
//   const { gId, uId } = req.params;
//   const game = activeGames.find((g) => g.id === gId);
//   if (game !== undefined && checkUserInGame(game, uId)) {
//     res.status(200)
//       .json(game);
//   } else {
//     next(errInexistentGame());
//   }
// });

// app.post('/game/:gId/:uId', async (req, res, next) => {
//   const { gId, uId } = req.params;
//   const game = activeGames.find((g) => g.id === Number(gId));
//   if (game !== undefined && checkUserInGame(game, uId)) {
//     try {
//       if (!submitMove(game, uId)) {
//         res.status(200)
//           .json(game);
//       } else {
//         performRoundCompletion(game);
//       }
//     } catch (e) {
//       const err = e;
//       err.status = 400;
//       next(err);
//     }
//   } else {
//     next(errWrongGame());
//   }
// });
