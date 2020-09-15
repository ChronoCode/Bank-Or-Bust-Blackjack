import React from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

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
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Coins Won</th>
              </tr>
            </thead>

            <tbody>
              {props.lbData.map((leaderData, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{leaderData.username}</td>
                    <td>{leaderData.coins}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
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