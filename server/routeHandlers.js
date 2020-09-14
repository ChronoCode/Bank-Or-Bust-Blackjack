const axios = require('axios');

const getDecks = async (req, res) => {
  // Gets cards from 6 decks, shuffled from "Deck of Cards" API
  let deckRes = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6');

  let cardRes = await axios.get(`https://deckofcardsapi.com/api/deck/${deckRes.data.deck_id}/draw/?count=312`);

  res.send(cardRes.data.cards);
}

module.exports = {
  getDecks,

}