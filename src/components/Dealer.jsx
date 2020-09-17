import React, { useState, useEffect } from 'react';
import cardBack from '../assets/red_masters_back.png';

const Dealer = (props) => {
  if (props.stage === 'afterDeal') {
    return (
      <div className='dealerHand'>
        <h3 className='handHeader'>Dealer's Hand:</h3>
        <div className='cardDisplay'>
          <img src={cardBack} />
          <img src={props.dealerHand[1].image} />
        </div>
      </div>
    );
  } else if (props.stage === 'playerStay'
    || props.stage === 'playerBust'
    || props.stage === 'roundOver') {
    return (
      <div className='dealerHand'>
        <h3 className='handHeader'>Dealer's Hand: {props.findCardTotal(props.dealerHand)}</h3>
        <div className='cardDisplay'>
          {props.dealerHand.map((card, index) => {
            return (
              <img src={card.image} key={index} />
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div></div>
    );
  }
}

export default Dealer;