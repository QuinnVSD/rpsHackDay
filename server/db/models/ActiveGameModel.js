const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const { Schema } = mongoose;

const ActiveGameSchema = new Schema({
  p1: String,
  p2: String,
});

ActiveGameSchema.plugin(autoIncrement.plugin, 'activeGame');

module.exports = mongoose.model('activeGame', ActiveGameSchema);
