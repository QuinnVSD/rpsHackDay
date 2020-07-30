const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://saltadmin:episalt@localhost/saltreviews';
const dbName = 'saltreviews';

async function addReview(data) {
  const client = await MongoClient.connect(url, { useNewUrlParser: true });
  const database = client.db(dbName);
  const mycol = database.collection('reviews');
  data.id = null;
}

async function getReview(reviewId, callback) {
  const client = await MongoClient.connect(url, { useNewUrlParser: true });
  const database = client.db(dbName);
  const mycol = database.collection('reviews');

  mycol.find({ id: reviewId })
    .toArray((err, response) => {
      callback(response);
    });
}

async function getReviews(callback) {
  const client = await MongoClient.connect(url, { useNewUrlParser: true });
  const database = client.db(dbName);
  const mycol = database.collection('reviews');

  mycol.find({})
    .toArray((err, response) => {
      callback(response);
    });
}

module.exports = {
  getReview,
  getReviews,
};


// [
//   {
// "_id":"5f214652e9c3c71480156cae",
//   "id":"135",
//   "productId":"1225226",
//   "productName":"The Salt bootcamp",
//   "productGroup":"Courses",
//   "title":"This product will rock you socks off!","description":"I bought this and now I cannot think about anything else","reviewer":"marcusoftnet","upvotes":["The Zarah","Mieselito","Adamsan","ZachAttack","Danjelovic","Levis Jeans"],"numberOfUpvotes":6}
// ]