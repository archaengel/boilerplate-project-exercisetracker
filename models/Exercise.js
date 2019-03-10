const mongoose  = require('mongoose')
const Schema    = mongoose.Schema

const exerciseSchema = new Schema({
  userId: {
    index: true,
    ref: 'User',
    required: true,
    type: String,
    unique: false,
  },
  username: String,
  description: {
    maxlength: 140,
    required: true,
    type: String,
  },
  duration: {
    min: 0,
    required: true,
    type: Number,
  },
  date: {
    default: () => Date.now(),
    type: Date,
  }
});

exerciseSchema.pre('save', function(next) {
  mongoose.model('User').findById(this.userId, (err, foundUser) => {
    if (err) return next(err)
    if (!foundUser) {
      const err = new Error("Unknown user Id.")
      err.status = 400
      return next(err)
    }
    this.username = foundUser.username
    console.log(this.date)
    next()
  })
})

module.exports = mongoose.model('Exercise', exerciseSchema)