const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// fake database (for now (maybe))
const games = [
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
    finished: false,
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

function checkUserInGame(game, uId) {
  return (game.p1.name === uId || game.p2.name === uId);
}

function errInexistentGame() {
  return true;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/game/:gId/:uId', async (req, res, next) => {
  const { gId, uId } = req.params;
  const game = games.find((g) => g.id === gId);
  if (game !== undefined && checkUserInGame(game, uId)) {
    res.status(200)
      .json(game);
  } else {
    next(errInexistentGame());
  }
});

app.post('/game/:gId/:uId', async (req, res, next) => {
  const { gId, uId } = req.params;
  const game = games.find((g) => g.id === gId);
  if (game !== undefined && checkUserInGame(game, uId)) {
    try {
      submitMove();
      res.status(200)
        .json(game);
    } catch (e) {
      res.status(200)
        .json(game);
    }
  } else {
    next(errInexistentGame());
  }
});

app.get('/result/:gId', (req, res, next) => {
  const { gId } = req.params;
  const game = games.find((g) => g.id === gId);
  if (game !== undefined) {
    res.status(200)
      .json(game);
  } else {
    next(errInexistentGame());
  }
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));

// res
// .json(data)
// .status(200)
// .end();
