import React from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Leaderboard = (props) => {
  return (
    <div>
      <div className='showLeaderboard'>
        <Button variant="primary" onClick={() => props.showHide(true)}>
          Show Leaderboard
        </Button>
      </div>

      <Modal show={props.showLeaderBoard} onHide={() => props.showHide(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Leaderboard:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Put leaderboard data here
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.showHide(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Leaderboard;