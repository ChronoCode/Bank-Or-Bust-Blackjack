const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  coins: Number
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;