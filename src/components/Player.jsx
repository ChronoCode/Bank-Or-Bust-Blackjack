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
        <div>You Busted</div>
      );
      if (props.stage !== 'playerBust') {
        setTimeout(() => props.stayOrBust('playerBust'), 3000);
      }
    } else if (total === 21){
      situationDiv = (
        <div>You Got 21!</div>
      );
      if (props.stage !== 'playerStay') {
        setTimeout(() => props.stayOrBust('playerStay'), 3000);
      }
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