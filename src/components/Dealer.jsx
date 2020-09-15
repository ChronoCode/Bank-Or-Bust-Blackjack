import React, { useState, useEffect } from 'react';
import cardBack from '../assets/red_masters_back.png';

const Dealer = (props) => {
  if (props.stage === 'afterDeal') {
    return (
      <div>
        <div>Dealer's Hand:</div>
        <img src={cardBack} />
        <img src={props.dealerHand[1].image} />
      </div>
    );
  } else if (props.stage === 'playerStay'
    || props.stage === 'playerBust'
    || props.stage === 'roundOver') {
    return (
      <div>
        <h3>Dealer's Hand:</h3>
        {props.dealerHand.map((card, index) => {
          return (
            <img src={card.image} key={index} />
          );
        })}
      </div>
    );
  } else {
    return (
      <div></div>
    );
  }
}

export default Dealer;