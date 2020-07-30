const { MongoClient, ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const url = 'mongodb://saltadmin:episalt@localhost/saltreviews';

mongoose.connect(url, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const { Schema } = mongoose;

// const pendingMoves = new Schema({
//   gameId: Number,
//   p1: String,
//   p2: String,
// },
// { collection: 'pendingMoves' });

// const players = new Schema({
//   name: String,
//   moves: Array,
// },
// { collection: 'players' });

// const allGames = new Schema({
//   gameId: Number,
//   completed: Boolean,
// },
// { collection: 'allGames' });

// const activeGames = new Schema({
//   gameId: Number,
//   p1: String,
//   p1Score: Number,
//   p2: String,
//   p2Score: Number,
//   scoreLimit: Number,
// },
// { collection: 'activeGames' });

// const finishedGames = new Schema({
//   gameId: Number,
//   p1: String,
//   p2: String,
//   winner: String,
// },
// { collection: 'finishedGames' });


const DB = mongoose.model('pendingMoves', 'players', 'allGames', 'activeGames', 'finishedGames');

async function findResultById(gId) {
  return finishedGames.findOne({ id: gId });
}

async function findActiveGameById(gId) {
  return activeGames.findOne({ id: gId });
}
module.exports = rpsServerDB;

// async function addReview(data) {
//   const client = await MongoClient.connect(url, { useNewUrlParser: true });
//   const database = client.db(dbName);
//   const mycol = database.collection('reviews');
//   data.id = null;
// }

// async function getReview(reviewId, callback) {
//   const client = await MongoClient.connect(url, { useNewUrlParser: true });
//   const database = client.db(dbName);
//   const mycol = database.collection('reviews');

//   mycol.find({ id: reviewId })
//     .toArray((err, response) => {
//       callback(response);
//     });
// }

// async function getReviews(callback) {
//   const client = await MongoClient.connect(url, { useNewUrlParser: true });
//   const database = client.db(dbName);
//   const mycol = database.collection('reviews');

//   mycol.find({})
//     .toArray((err, response) => {
//       callback(response);
//     });
// }

// module.exports = {
//   getReview,
//   getReviews,
// };


// [
//   {
// "_id":"5f214652e9c3c71480156cae",
//   "id":"135",
//   "productId":"1225226",
//   "productName":"The Salt bootcamp",
//   "productGroup":"Courses",
//   "title":"This product will rock you socks off!","description":"I bought this and now I cannot think about anything else","reviewer":"marcusoftnet","upvotes":["The Zarah","Mieselito","Adamsan","ZachAttack","Danjelovic","Levis Jeans"],"numberOfUpvotes":6}
// ]