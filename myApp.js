const mongodb = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParse: true,
    dbname: 'exercisetracker'
  }
);