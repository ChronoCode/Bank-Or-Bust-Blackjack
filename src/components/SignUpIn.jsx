import React, { useState } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';

const SignUpIn = (props) => {
  let [signUpName, setSignUpName] = useState('');
  let [signUpPW, setSignUpPW] = useState('');
  let [signInName, setSignInName] = useState('');
  let [signInPW, setSignInPW] = useState('');

  let [showTooShort, setShowTooShort] = useState(false);
  let [alreadyExists, setAlreadyExists] = useState(false);

  let [notValid, setNotValid] = useState(false);

  const signUp = () => {
    setAlreadyExists(false);
    if (signUpName.length > 0 && signUpPW.length > 0) {
      axios.post('/signup',
        {
          username: signUpName,
          password: signUpPW
        }
      )
        .then((res) => {
          if (res.data === 'duplicate') {
            setAlreadyExists(true);
          } else {
            props.setStage('beforeDeal');
            props.setUsername(signUpName);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setShowTooShort(true);
    }
  }

  const signIn = () => {
    if (signInName.length > 0 && signInPW.length > 0) {
      axios.post('/login',
        {
          username: signInName,
          password: signInPW
        }
      )
        .then((res) => {
          if (res.data) {
            props.setAvailableCoins(res.data.coins);
            props.setStage('beforeDeal');
            props.setUsername(signInName);
          } else {
            setNotValid(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  let signUpWarning = null;
  if (showTooShort) {
    signUpWarning = (<Alert variant='primary'>Either your username or password is too short.</Alert>);
  }

  let signUpDuplicate = null;
  if (alreadyExists) {
    signUpDuplicate = (<Alert variant='primary'>I am sorry, that username is already in use, please try a different one.</Alert>);
  }

  let notValidSignIn = null;
  if (notValid) {
    notValidSignIn = (<Alert variant='primary'>I am sorry, the username or password you have entered is incorrect.</Alert>);
  }

  return (
    <div className='signUpIn'>
      <div className='signUp'>
        <h3>Sign Up:</h3>
        {signUpWarning}
        {signUpDuplicate}
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Username: </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="username"
            onChange={(event) => setSignUpName(event.target.value.trim())}
          />
        </InputGroup>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Password: </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="password"
            onChange={(event) => setSignUpPW(event.target.value.trim())}
          />
        </InputGroup>
        <Button onClick={signUp}>Sign Up</Button>
      </div>
      <div className='signIn'>
        <h3>Sign In:</h3>
        {notValidSignIn}
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Username: </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="username"
            onChange={(event) => setSignInName(event.target.value.trim())}
          />
        </InputGroup>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Password: </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="password"
            onChange={(event) => setSignInPW(event.target.value.trim())}
          />
        </InputGroup>
        <Button onClick={signIn} >Sign In</Button>
      </div>
    </div>
  );
}

export default SignUpIn;