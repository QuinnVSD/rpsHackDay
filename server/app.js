const express = require('express');
const bodyParser = require('body-parser');

const db = require('./db');

const app = express();

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

app.get('/result/:gId', async (req, res, next) => {
  const { gId } = req.params;
  const game = await db.findResultById(gId);
  if (game) {
    res.status(200)
      .json(game);
  } else {
    next(errInexistentResult());
  }
});

app.get('/game/:gId/:uId', async (req, res, next) => {
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

