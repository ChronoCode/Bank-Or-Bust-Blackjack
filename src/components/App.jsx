import React from 'react';
import axios from 'axios';

import Dealer from './Dealer.jsx';
import Player from './Player.jsx';
import SignUpIn from './SignUpIn.jsx';
import Leaderboard from './Leaderboard.jsx';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

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
      previousCoins: 0,
      bet: 0,
      notEnoughCoins: false,
      coinValueSent: false,
      leaderBoard: [],
      showLeaderBoard: false
    };

    this.getNewShoe = this.getNewShoe.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.dealInitialCards = this.dealInitialCards.bind(this);
    this.stayOrBust = this.stayOrBust.bind(this);
    this.setBet = this.setBet.bind(this);
    this.findCardTotal = this.findCardTotal.bind(this);
    this.doubleDown = this.doubleDown.bind(this);
  }

  componentDidMount() {
    this.getNewShoe();
    this.updateLeaderBoardData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.coins !== this.state.previousCoins) {
      this.updateLeaderBoardData();
      this.setState({ previousCoins: this.state.coins });
    }
  }

  updateLeaderBoardData() {
    axios.get('/leaderboard')
      .then((res) => {
        this.setState({ leaderBoard: res.data });
      });
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

    let newBet = this.state.bet;
    let newCoins = this.state.coins - this.state.bet;

    if (newCoins < 0) {
      newCoins = 0;
      newBet = this.state.coins;
    }

    this.setState({
      shoe: remaining,
      dealerHand: newDealerHand,
      playerHand: newPlayerHand,
      stage: 'afterDeal',
      coins: newCoins,
      bet: newBet
    });
  }

  doubleDown() {
    // prevents doubling down when not enough coins
    if (this.state.bet < this.state.coins) {
      let newCard = this.drawCard();

      this.setState({
        coins: this.state.coins - this.state.bet,
        bet: this.state.bet * 2,
        playerHand: this.state.playerHand.concat(newCard),
        stage: 'playerStay'
      });
    }
  }

  stayOrBust(situ) {
    this.setState({ stage: situ });

    if (situ === 'playerStay') {
      // inner if handles player blackjack
      if (!(this.findCardTotal(this.state.playerHand) === 21
        && this.state.playerHand.length === 2)) {
        let newDealerHand = [];
        newDealerHand = newDealerHand.concat(this.state.dealerHand);
        while (this.findCardTotal(newDealerHand) < 17) {
          newDealerHand = newDealerHand.concat(this.drawCard());
        }

        this.setState({ dealerHand: newDealerHand });
      }
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
    } else if (pTotal === 21
      && dTotal === 21
      && this.state.dealerHand.length === 2
      && this.state.playerHand.length > 2) {
      return 'dealer';
    } else if (pTotal === 21
      && dTotal === 21
      && this.state.dealerHand.length > 2
      && this.state.playerHand.length === 2) {
      return 'player';
    } else {
      return 'push';
    }
  }

  render() {
    if (this.state.stage === 'signUpIn') {
      return (
        <Container className='appContainer'>
          <h1 className='title'>Bank-Or-Bust Blackjack</h1>
          <Leaderboard
            lbData={this.state.leaderBoard}
            showLeaderBoard={this.state.showLeaderBoard}
            showHide={(show) => this.setState({ showLeaderBoard: show })}
          />
          <SignUpIn
            setAvailableCoins={(value) => this.setState({ coins: value })}
            setStage={(stage) => this.setState({ stage })}
            setUsername={(username) => this.setState({ username })}
          />
        </Container>
      );
    } else {
      let playAgainButton = null;
      let message = null;
      if (this.state.stage === 'playerStay'
        || this.state.stage === 'playerBust'
        || this.state.stage === 'roundOver') {
        let winner = this.findWinner();
        if (winner === 'player') {
          if (this.findCardTotal(this.state.playerHand) === 21
            && this.state.playerHand.length === 2) {
            message = (
              <Alert className='alert blackjack' variant='primary'>You got Blackjack! You win 2.5 times your bet!</Alert>
            );
          } else if (this.findCardTotal(this.state.dealerHand) > 21) {
            message = (
              <Alert className='alert dBust' variant='primary'>The Dealer Busted! You Win!</Alert>
            );
          } else {
            message = (
              <Alert className='alert win' variant='primary'>You Win!</Alert>
            );
          }
          if (this.findCardTotal(this.state.playerHand) === 21
            && this.state.playerHand.length === 2
            && this.state.stage !== 'roundOver') {
            setTimeout(() => this.setState({
              stage: 'roundOver',
              coins: this.state.coins + (this.state.bet * 2.5)
            }), 0);
          } else if (this.state.stage !== 'roundOver') {
            setTimeout(() => this.setState({
              stage: 'roundOver',
              coins: this.state.coins + (this.state.bet * 2)
            }), 0);
          }
        } else if (winner === 'dealer') {
          message = (
            <Alert className='alert lose' variant='primary'>Dealer wins, you lose.</Alert>
          );
          if (this.state.stage !== 'roundOver') {
            setTimeout(() => this.setState({
              stage: 'roundOver'
            }), 0);
          }
        } else if (winner === 'push') {
          message = (
            <Alert className='alert' variant='primary'>It's a push.</Alert>
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

        playAgainButton = (
          <div className='playerActions'>
            <Button onClick={() => this.setState(
              {
                stage: 'beforeDeal',
                dealerHand: [],
                playerHand: [],
                coinValueSent: false
              })} >Play Again?
            </Button>
          </div>
        );
      }

      if (this.state.shoe.length > 0) {
        return (
          <Container className='appContainer'>
            {/* <h1 className='title'>Bank-Or-Bust Blackjack</h1> */}
            <Leaderboard
              lbData={this.state.leaderBoard}
              showLeaderBoard={this.state.showLeaderBoard}
              showHide={(show) => this.setState({ showLeaderBoard: show })}
              stage={this.state.stage}
            />
            <div className='coinValues'>
              <h5>Your Coins: {this.state.coins}</h5>
              <h5>Current Bet: {this.state.bet}</h5>
            </div>
            <div className='message'>
              {message}
            </div>
            <Dealer dealerHand={this.state.dealerHand}
              stage={this.state.stage} />
            <Player playerHand={this.state.playerHand}
              stage={this.state.stage}
              drawCardForPlayer={() => this.setState({ playerHand: this.state.playerHand.concat(this.drawCard()) })}
              dealInitialCards={this.dealInitialCards}
              stayOrBust={this.stayOrBust}
              setBet={this.setBet}
              doubleDown={this.doubleDown}
              findCardTotal={this.findCardTotal}
              notEnoughCoins={this.state.notEnoughCoins}
            />
            {playAgainButton}
          </Container>
        );
      } else {
        return (<div></div>);
      }
    }
  }
}

export default App;
