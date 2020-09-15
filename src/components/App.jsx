import React from 'react';
import axios from 'axios';

import Dealer from './Dealer.jsx';
import Player from './Player.jsx';
import SignUpIn from './SignUpIn.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      shoe: [],
      dealerHand: [],
      playerHand: [],
      stage: 'signUpIn',
      coins: 1000,
      bet: 0,
      notEnoughCoins: false,
      coinValueSent: false
    };

    this.getNewShoe = this.getNewShoe.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.dealInitialCards = this.dealInitialCards.bind(this);
    this.stayOrBust = this.stayOrBust.bind(this);
    this.setBet = this.setBet.bind(this);
    this.findCardTotal = this.findCardTotal.bind(this);
  }

  componentDidMount() {
    this.getNewShoe();
  }

  getNewShoe() {
    axios.get('/decks')
      .then((res) => {
        this.setState({ shoe: res.data })
      });
  }

  setBet(value) {
    if (value > this.state.coins) {
      this.setState({ notEnoughCoins: true, bet: 0 });
    } else {
      this.setState({ notEnoughCoins: false, bet: value });
    }
  }

  drawCard() {
    let topCard = this.state.shoe[0];

    let remaining = this.state.shoe.slice(1);

    this.setState({ shoe: remaining });

    return topCard;
  }

  dealInitialCards() {
    let newPlayerHand = [this.state.shoe[0], this.state.shoe[2]];
    let newDealerHand = [this.state.shoe[1], this.state.shoe[3]];

    let remaining = this.state.shoe.slice(4);

    this.setState({
      shoe: remaining,
      dealerHand: newDealerHand,
      playerHand: newPlayerHand,
      stage: 'afterDeal',
      coins: this.state.coins - this.state.bet
    });
  }

  stayOrBust(situ) {
    this.setState({ stage: situ });

    if (situ === 'playerStay') {
      let newDealerHand = [];
      newDealerHand = newDealerHand.concat(this.state.dealerHand);
      while (this.findCardTotal(newDealerHand) < 17) {
        newDealerHand = newDealerHand.concat(this.drawCard());
      }

      this.setState({ dealerHand: newDealerHand });
    }
  }

  cardValue(total, card) {
    if (Number.isNaN(Number(card.value))) {
      if (card.value === "ACE") {
        return (total > 10 ? 1 : 11);
      } else {
        return 10;
      }
    } else {
      return Number(card.value);
    }
  }

  findCardTotal(whoseHand) {
    let total = 0;
    let aces = [];
    for (let i = 0; i < whoseHand.length; i++) {
      if (whoseHand[i].value === "ACE") {
        aces.push(whoseHand[i]);
      } else {
        total += this.cardValue(total, whoseHand[i]);
      }
    }

    for (let j = 0; j < aces.length; j++) {
      total += this.cardValue(total, aces[j]);
    }

    return total;
  }

  findWinner() {
    let dTotal = this.findCardTotal(this.state.dealerHand);

    let pTotal = this.findCardTotal(this.state.playerHand);

    if (pTotal > 21) {
      return 'dealer';
    } else if (pTotal > dTotal) {
      return 'player';
    } else if (dTotal > pTotal && dTotal <= 21) {
      return 'dealer';
    } else if (dTotal > 21) {
      return 'player';
    } else {
      return 'push';
    }
  }

  render() {
    if (this.state.stage === 'signUpIn') {
      return (
        <div>
          <h1>Bank-Or-Bust Blackjack</h1>
          <SignUpIn
            setAvailableCoins={(value) => this.setState({ coins: value })}
            setStage={(stage) => this.setState({ stage })}
            setUsername={(username) => this.setState({ username })}
          />
        </div>
      );
    } else {
      let playAgainButton = null;
      let message = null;
      if (this.state.stage === 'playerStay'
        || this.state.stage === 'playerBust'
        || this.state.stage === 'roundOver') {
        let winner = this.findWinner();
        if (winner === 'player') {
          if (this.findCardTotal(this.state.dealerHand) > 21) {
            message = (
              <div>The Dealer Busted! You Win!</div>
            );
          } else {
            message = (
              <div>You Win!</div>
            );
          }
          if (this.state.stage !== 'roundOver') {
            setTimeout(() => this.setState({
              stage: 'roundOver',
              coins: this.state.coins + (this.state.bet * 2)
            }), 0);
          }
        } else if (winner === 'dealer') {
          message = (
            <div>Dealer wins, you lose.</div>
          );
          if (this.state.stage !== 'roundOver') {
            setTimeout(() => this.setState({
              stage: 'roundOver'
            }), 0);
          }
        } else if (winner === 'push') {
          message = (
            <div>It's a push.</div>
          );
          if (this.state.stage !== 'roundOver') {
            console.log('printed')
            setTimeout(() => this.setState({
              stage: 'roundOver',
              coins: this.state.coins + this.state.bet
            }), 0);
          }
        }

        if (!this.state.coinValueSent) {
          setTimeout( () => {
            this.setState({ coinValueSent: true });
            axios.put('/updateCoins', { username: this.state.username, coins: this.state.coins });
          }, 0);
        }

        playAgainButton = (<button onClick={() => this.setState(
          {
            stage: 'beforeDeal',
            dealerHand: [],
            playerHand: [],
            coinValueSent: false,
            bet: 0
          })} >Play Again?</button>);
      }

      if (this.state.shoe.length > 0) {
        return (
          <div>
            <h1>Bank-Or-Bust Blackjack</h1>
            <div className='coinValues'>
              <div>Your Coins: {this.state.coins}</div>
              <div>Current Bet: {this.state.bet}</div>
            </div>
            {message}
            <Dealer dealerHand={this.state.dealerHand}
              stage={this.state.stage} />
            <Player playerHand={this.state.playerHand}
              stage={this.state.stage}
              drawCardForPlayer={() => this.setState({ playerHand: this.state.playerHand.concat(this.drawCard()) })}
              dealInitialCards={this.dealInitialCards}
              stayOrBust={this.stayOrBust}
              setBet={this.setBet}
              findCardTotal={this.findCardTotal}
              notEnoughCoins={this.state.notEnoughCoins}
            />
            {playAgainButton}
          </div>
        );
      } else {
        return (<div></div>);
      }
    }
  }
}

export default App;
