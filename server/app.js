const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// fake database (for now (maybe))
const completedGames = [
];

const activeGames = [
  {
    id: 0,
    p1: {
      name: 'Lucius',
      moves: ['R', 'R'],
      score: 1,
    },
    p2: {
      name: 'Vesper',
      moves: ['R', 'S'],
      score: 0,
    },
    scoreLimit: 2,
    p1Wins: null,
  },
];

const secretMoves = [
  {
    gameId: 0,
    p1: 'R',
    p2: null,
  },
];

function performGameCompletion() {
  return true;
}

function checkP1BeatsP2(moveP1, moveP2) {
  if ((moveP1 === 'R' && moveP2 === 'S')
  || (moveP1 === 'S' && moveP2 === 'P')
  || (moveP1 === 'P' && moveP2 === 'R')) {
    return true;
  }
  return false;
}

function performRoundCompletion(game) {
  const moveStorage = secretMoves.find((g) => g.id === game.id);
  const p1Move = moveStorage.p1;
  const p2Move = moveStorage.p2;
  game.p1.moves.push(moveStorage.p1);
  game.p2.moves.push(moveStorage.p2);
  moveStorage.p1 = null;
  moveStorage.p2 = null;
  if (p1Move === p2Move) {
    return;
  }
  const winner = checkP1BeatsP2(p1Move, p2Move) ? 'p1' : 'p2';
  const loser = winner === 'p1' ? 'p2' : p1;
  game[winner].score += 1;
  if (game[winner].score === game.scoreLimit) {
    performGameCompletion(game);
  }
}

function checkUserInGame(game, uId) {
  return (game.p1.name === uId || game.p2.name === uId);
}

function errInexistentGame() {
  const err = new Error('Invalid Game ID');
  err.status = 404;
  return err;
}

function errWrongGame() {
  const err = new Error('That game is either inactive, or you do not have access to it!');
  err.status = 404;
  return err;
}

// submits move AND RETURNS boolean representing round completion (to prevent double db access)
function submitMove(game, uId, move) {
  const activePlayer = game.p1.name === uId ? 'p1' : 'p2';
  const storedMove = secretMoves.find((g) => g.gameId === game.id)[activePlayer];
  if (storedMove) throw new Error('No move expected from that user');
  secretMoves[activePlayer] = move;
  if (secretMoves.p1 && secretMoves.p2) return true;
  return false;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/game/:gId/:uId', async (req, res, next) => {
  const { gId, uId } = req.params;
  const game = activeGames.find((g) => g.id === gId);
  if (game !== undefined && checkUserInGame(game, uId)) {
    res.status(200)
      .json(game);
  } else {
    next(errInexistentGame());
  }
});

app.post('/game/:gId/:uId', async (req, res, next) => {
  const { gId, uId } = req.params;
  const game = activeGames.find((g) => g.id === Number(gId));
  if (game !== undefined && checkUserInGame(game, uId)) {
    try {
      if (!submitMove(game, uId)) {
        res.status(200)
          .json(game);
      } else {
        performRoundCompletion(game);
      }
    } catch (e) {
      const err = e;
      err.status = 400;
      next(err);
    }
  } else {
    next(errWrongGame());
  }
});

app.get('/result/:gId', (req, res, next) => {
  const { gId } = req.params;
  const game = activeGames.find((g) => g.id === Number(gId));
  if (game !== undefined) {
    res.status(200)
      .json(game);
  } else {
    next(errInexistentGame());
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
