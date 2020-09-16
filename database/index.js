const mongoose = require('mongoose');
// 'mongodb+srv://bobbUser:tams2atdb@bank-or-bust-blackjack.ceu1n.mongodb.net/bobb?retryWrites=true&w=majority'

let connectionString = process.env.MONGODB_URI;

mongoose.connect( connectionString,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});

module.exports = db;