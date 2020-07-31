/* eslint-disable no-console */

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db = {
  players: [],
  activeGames: [],
  finishedGame: [],
  pendingMoves: [],
  gameIdCounter: 1,
  userIdCounter: 1,
};

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

function checkP1BeatsP2(p1Move, p2Move) {
  if ((p1Move === 'R' && p2Move === 'S')
    || (p1Move === 'S' && p2Move === 'P')
    || (p1Move === 'P' && p2Move === 'R')) {
    return true;
  }
  return false;
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
app.post('/initialize', async (req, res) => {
  db = {
    players: [],
    activeGames: [],
    finishedGame: [],
    pendingMoves: [],
    gameIdCounter: 1,
    userIdCounter: 1,
  };
  res.status(204)
    .send();
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

function getPlayerIndexByName(name) {
  return db.players.findIndex((item) => item.name === name);
}

function createPlayer(name) {
  db.players.push({
    name,
    id: db.userIdCounter,
    gameCount: 0,
    winCount: 0,
    activeGames: [],
  });
  db.userIdCounter += 1;
}

// basic authentication. password hardcoded "secret"
app.post('/auth', async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (password === 'secret') {
      req.session.loggedin = true;
      req.session.username = username;
      if (getPlayerIndexByName(username) < 0) {
        createPlayer(username);
      }
      res.redirect('/home');
    } else {
      res.send('Incorrect Username and/or Password!');
    }
  } else {
    res.send('Please enter Username and Password!');
  }
});

// returns list of all players
app.get('/players', async (req, res) => {
  res.status(200)
    .json(db.players);
});

// returns single player
app.get('/players/:username', async (req, res, next) => {
  const { username } = req.params;
  const playerIndex = getPlayerIndexByName(username);
  res.status(200)
    .json(db.players[playerIndex]);
});

// creates new player
app.post('/players/:username', async (req, res, next) => {
  const { username } = req.params;
  createPlayer(username);
  res.status(201)
    .send();
});

// responds with list of all active games
app.get('/games', async (req, res, next) => {
  res.status(200)
    .json(db.activeGames);
});

// responds with pending moves
app.get('/secret', async (req, res, next) => {
  res.status(200)
    .json(db.pendingMoves);
});

// responds of list of all active games that a player is in
app.get('/games/:player', async (req, res, next) => {
  const { player } = req.params;
  const games = db.activeGames.filter((game) => game.p1 === player || game.p2 === player);
  res.status(200)
    .json(games);
});

function addActiveGame(p1, p2, maxScore) {
  db.activeGames.push({
    id: db.gameIdCounter,
    p1: {
      name: p1,
      score: 0,
      moves: [],
    },
    p2: {
      name: p2,
      score: 0,
      moves: [],
    },
    maxScore,
  });
  db.gameIdCounter += 1;
}

// accepts 2 player names in the body to start a new game between them
app.post('/games', async (req, res, next) => {
  const { p1, p2, maxScore } = req.body;
  addActiveGame(p1, p2, maxScore);
  res.status(201)
    .send();
});

function getActiveGameById(id) {
  return db.activeGames.find((game) => game.id === id);
}

function checkUserInGame(game, user) {
  return (game.p1.name === user || game.p2.name === user);
}

// gets a specific game, only works if signed in user is in that game
app.get('/games/:gId/:user', async (req, res, next) => {
  const { gId, user } = req.params;
  const game = db.getActiveGameById(gId)
  if (game && checkUserInGame(game, user)) {
    res.status(200)
      .json(game);
  } else {
    next(errWrongGame());
  }
});

function submitMove(gId, userSide, move) {
  if (!db.pendingMoves[userSide]) {
    db.pendingMoves[userSide] = move;
    if (db.pendingMoves.p1 && db.pendingMoves.p2)
  }
}


// submits move
app.post('/games/:gId/:user', async (req, res, next) => {
  const { gId, user } = req.params;
  const { move } = req.body;
  if (move !== 'R' && move !== 'S' && move !== 'P') next();
  const game = getActiveGameById(gId);
  if (game !== undefined && checkUserInGame(game, user)) {
    const userSide = (game.p1.name === user) ? 'p1' : 'p2';
    submitMove(gId, userSide, move);
    db.getHiddenMoves(gId, (pendingMoves) => {
      // db.assignMovesToPlayers({ gId });
      console.log(pendingMoves);
      const { p1, p2 } = pendingMoves;
      if (p1 && p2) {
        if (p1 === p2) {
          db.resetGame(gId);
        } else {
          const winner = checkP1BeatsP2(p1, p2) ? 'p1' : 'p2';
          db.resolveGame(gId, winner);
        }
      } else {
        res.status(201)
          .send();
      }
    });
    // const otherSide = (userSide === 'p1') ? 'p2' : 'p1';

    // db.getHiddenMoves(gId, (pendingMoves) => {
    //   const { p1Move, p2Move } = pendingMoves;
    //   if (p1Move && p2Move) {
    //     if (p1Move === p2Move) {
    //       db.resetRound(gId);
    //     } else {
    //       if (checkP1BeatsP2)
    //     }
    //   }
    // });
    // db.checkNeedToSubmit(gId, userSide, () => {
    //   db.checkNeedToSubmit(gId, otherSide, () => {
    //     return true // first callback asks for next move
    //   });
    // });
  }
});

  // const game = activeGames.find((g) => g.id === Number(gId));
  // if (game !== undefined && checkUserInGame(game, uId)) {
  //   try {
  //     if (!submitMove(game, uId)) {
  //       res.status(200)
  //         .json(game);
  //     } else {
  //       performRoundCompletion(game);
  //     }
  //   } catch (e) {
  //     const err = e;
  //     err.status = 400;
  //     next(err);
  //   }
  // } else {
  //   next(errWrongGame());
  // }
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
