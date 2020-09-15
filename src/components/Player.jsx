import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

const Player = (props) => {
  let [betValue, setBetValue] = useState(0);

  if (props.stage === 'beforeDeal') {
    let notEnoughCoinsWarning = null;
    if (props.notEnoughCoins) {
      notEnoughCoinsWarning = (<div>You cannot bet more than you have.</div>);
    }

    return (
      <div className='betInput'>
        {notEnoughCoinsWarning}
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Bet: </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type='number'
            min='0'
            onChange={(event) => setBetValue(Number(event.target.value))}
          />
        </InputGroup>
        <div className='betButtons'>
          <Button onClick={() => props.setBet(betValue)}>Set Bet Amount</Button>
          <Button onClick={props.dealInitialCards}>Deal!</Button>
        </div>
      </div>
    );
  } else {
    let total = props.findCardTotal(props.playerHand);

    let situationDiv = null;
    if (total < 21 && props.stage !== 'playerStay' && props.stage !== 'roundOver') {
      situationDiv = (
        <div className='playerActions'>
          <Button onClick={() => props.stayOrBust('playerStay')}>Stay</Button>
          <Button onClick={props.drawCardForPlayer}>Hit Me!</Button>
        </div>
      );
    } else if (total > 21) {
      situationDiv = (
        <div className='playerActions'>
          <h3>You Busted</h3>
          {props.stage === 'playerBust' || props.stage === 'roundOver' ? null : <Button onClick={(event) => props.stayOrBust('playerBust')}>See Dealer's Cards</Button>}
        </div>
      );
    } else if (total === 21) {
      situationDiv = (
        <div className='playerActions'>
          <h3>You Got 21!</h3>
          <Button onClick={() => props.stayOrBust('playerStay')}>See Dealer's Cards</Button>
        </div>
      );
    }

    return (
      <div className='playerHand'>
        <h3 className='handHeader'>Player's Hand:</h3>
        <div className='cardDisplay'>
          {props.playerHand.map((card, index) => {
            return (
              <img src={card.image} key={index} />
            );
          })}
        </div>
        {situationDiv}
      </div>
    );
  }
}

export default Player;