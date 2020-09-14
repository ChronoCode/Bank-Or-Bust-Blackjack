import React, { useState, useEffect } from 'react';

const Player = (props) => {
  let [betValue, setBetValue] = useState(0);

  if (props.stage === 'beforeDeal') {
    let notEnoughCoinsWarning = null;
    if (props.notEnoughCoins) {
      notEnoughCoinsWarning = (<div>You cannot bet more than you have.</div>);
    }

    return (
      <div>
        {notEnoughCoinsWarning}
        <input type='number' min='0' onChange={(event) => setBetValue(Number(event.target.value))} />
        <button onClick={() => props.setBet(betValue)}>Set Bet Amount</button>
        <button onClick={props.dealInitialCards}>Deal!</button>
      </div>
    );
  } else {
    let total = props.findCardTotal(props.playerHand);

    let situationDiv = null;
    if (total < 21 && props.stage !== 'playerStay' && props.stage !== 'roundOver') {
      situationDiv = (
        <div>
          <button onClick={props.drawCardForPlayer}>Hit Me!</button>
          <button onClick={() => props.stayOrBust('playerStay')}>Stay</button>
        </div>
      );
    } else if (total > 21) {
      situationDiv = (
        <div>
          <div>You Busted</div>
          {props.stage === 'playerBust' || props.stage === 'roundOver' ? null : <button onClick={(event) => props.stayOrBust('playerBust')}>See Dealer's Cards</button>}
        </div>
      );
    } else if (total === 21) {
      situationDiv = (
        <div>
          <div>You Got 21!</div>
          <button onClick={() => props.stayOrBust('playerStay')}>Stay</button>
        </div>
      );
    }

    return (
      <div>
        <div>Player's Hand:</div>
        <div>
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