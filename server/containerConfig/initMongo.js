/* global db */
db.createUser(
  {
    user: 'saltadmin',
    pwd: 'episalt',
    roles: [
      {
        role: 'readWrite',
        db: 'saltreviews',
      },
    ],
  },
);

// db.createCollection('players');
// db.createCollection('activeGanes');
// db.createCollection('finishedGames');
// db.createCollection('pendingMoves');
// db.active_games.insert({
//   id: 0,
//   p1: {
//     name: 'Lucius',
//     moves: ['R', 'R'],
//     score: 1,
//   },
//   p2: {
//     name: 'Vesper',
//     moves: ['R', 'S'],
//     score: 0,
//   },
//   scoreLimit: 2,
//   p1Wins: null,
// });
// db.secret_moves.insert({
//   gameId: 0,
//   p1: 'R',
//   p2: null,
// });

// const { MongoClient } = require('mongodb');

// const url = 'mongodb://localhost:27017'; const dbName = 'saltdb';
// async function run() {
//   const client = await MongoClient.connect(url, { useNewUrlParser: true });
//   const db = client.db(dbName);
//   db.on('close', () => { process.stdout.write('lost connection'); });
//   db.on('reconnect', () => { process.stdout.write('reconnected'); });
//   const reviews = db.collection('reviews');

//   setTimeout(() => client.close(), 1000);
// }
// run();
