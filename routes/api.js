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
      savedExercise.date = savedExercise.date.toDateString()
      res.json(savedExercise)
    }
  })
});

router.get('/users', (req, res, next) => {
  User
    .find({})
    .sort({_id: 'asc'})
    .select('-__v')
    .exec((err, userList) => {
    if (err) {
      console.log(err)
      return next(err)
    } else {
      res.json(userList)
    }
  })
});

router.get('/log',(req, res, next) => {
  let startDate = req.query.from ? new Date(req.query.from) : 0
  let endDate = req.query.to ? new Date(req.query.to) : new Date()
  let limit = req.query.limit != undefined
                ? parseInt(req.query.limit)
                : Number.MAX_SAFE_INTEGER
  
  if (!req.query.userId) {
    let err = new Error("userId is required")
    next(err)
  } else {
    Exercise
      .find({
        userId: req.query.userId,
        date: { $gte: startDate, $lte: endDate }
      }, 'description duration date -_id')
      .limit(limit)
      .exec((err, exercises) => {
      if (err) {
        return next(err)
      } else {
        User
          .findById(req.query.userId)
          .select('-__v')
          .exec((err, foundUser) => {
            foundUser = foundUser.toObject()
            foundUser.log = exercises
            res.json(foundUser)
        })
      }
    })
  }
  // res.send(req.originalUrl)
});

module.exports = router