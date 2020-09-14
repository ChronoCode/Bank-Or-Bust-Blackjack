const Player = require('../models/player.js');
const db = require('../index.js');

const signUp = async (userData) => {
  userData.coins = 1000;

  let dbRes;
  try {
    dbRes = await Player.create(userData);
  } catch (err) {
    dbRes = err.code;
  }

  return dbRes;
};

const logIn = async (userData) => {
  let dbRes;
  try {
    dbRes = await Player.findOne(userData, '-_id username coins');
  } catch (err) {
    console.log(err);
  }

  return dbRes;
}

const updateCoins = async (coinData) => {
  let dbRes = await Player.findOneAndUpdate(
    { username: coinData.username },
    { coins: coinData.coins }
  );

  return dbRes;
}

module.exports = {
  signUp,
  logIn,
  updateCoins
};
