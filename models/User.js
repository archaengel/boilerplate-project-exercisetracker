const mongoose = require('mongoose')
const Schema = mongoose.Schema
const animalIds = require('animal-ids')

const userSchema = new Schema({
  username: {
    required: true,
    type: String,
    unique: true,
  },
  _id: {
    default: animalIds.generateID(2),
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema)