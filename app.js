const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// fake database (for now (maybe))
const games = [
  {
    id: 0,
    p1: 'Lucius',
    p2: 'Vesper',
    scoreLimit: 1,
    p1Moves: ['R', 'R'],
    p2Moves: ['R', 'S'],
    p1Score: 1,
    p2Score: 0,
    finished: true,
    p1Wins: true,
  },
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/game/:gId/:uId', async (req, res) => {
  const { gId, uId } = req.params;
  const game = games.find(g => g.id === gId);
  if (game !== undefined) {
    res.status(200)
      .json(game);
  } else {
    next(errInexistentGame());
  }

});

app.get('/result/:gId', (req, res) => {
  const { gId } = req.params;
  const game = games.find(g => g.id === gID);
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