const router = require('express').Router()
const mongoose = require('mongoose')

const Exercise = require('../models/Exercise')
const User = require('../models/User')

mongoose.connect(
  process.env.MONGO_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    dbName: 'exercisetracker'
  }
)
.then(() => console.log(`Succesfully connected to db '${mongoose.connection.name}'`))
.catch(error => console.log(error.message));

router.post('/new-user', (req, res, next) => {
  let userToBeSaved = new User({username: req.body.username})
  userToBeSaved.save((err, savedUser) => {
    if (err) {
      if (err.code == 11000) {
        return next({
          status: 400,
          message: 'username already taken'
        })
      } else {
        return next(err)
      }
    } else {
      res.json({
        username: savedUser.username,
        _id: savedUser._id
      })
    }
  })
});

router.post('/add', (req, res, next) => {
  let exerciseToBeSaved = new Exercise(req.body)
  exerciseToBeSaved.save((err, savedExercise) => {
    if (err) {
      next(err)
    } else {
      res.json(savedExercise)
    }
  })
})

module.exports = router