const express = require('express');

const routeHandlers = require('./routeHandlers.js');
const dbControl = require('../database/controllers/controllers.js');

const app = express();
const PORT = 3000;

app.use(express.static('dist'));

app.use(express.json());

app.get('/decks', routeHandlers.getDecks);

app.post('/signup', async (req, res) => {
  let dbResponse = await dbControl.signUp(req.body);

  if (dbResponse === 11000) {
    res.send('duplicate');
  } else {
    res.status(204).send('created');
  }
});

app.post('/login', async (req, res) => {
  let dbResponse = await dbControl.logIn(req.body);

  res.send(dbResponse);
});

app.put('/updateCoins', async (req, res) => {
  let dbResponse = await dbControl.updateCoins(req.body);

  res.send(dbResponse);
});

app.get('/leaderboard', async (req, res) => {
  let dbResponse = await dbControl.getLeaderBoard();

  res.send(dbResponse);
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));