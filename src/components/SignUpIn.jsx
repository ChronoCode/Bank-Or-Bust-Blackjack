import React, { useState } from 'react';
import axios from 'axios';

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
    signUpWarning = (<div>Either your username or password is too short.</div>);
  }

  let signUpDuplicate = null;
  if (alreadyExists) {
    signUpDuplicate = (<div>I am sorry, that username is already in use, please try a different one.</div>);
  }

  let notValidSignIn = null;
  if (notValid) {
    notValidSignIn = (<div>I am sorry, the username or password you have entered is incorrect.</div>);
  }

  return (
    <div className='signUpIn'>
      <div className='signUp'>
        <h3>Sign Up:</h3>
        {signUpWarning}
        {signUpDuplicate}
        <label>Username:
        <input type='text'
            onChange={(event) => setSignUpName(event.target.value.trim())}
          /></label>
        <label>Password:
        <input type='text'
            onChange={(event) => setSignUpPW(event.target.value.trim())}
          /></label>
        <button onClick={signUp}>Sign Up</button>
      </div>
      <div className='signIn'>
        <h3>Sign In:</h3>
        {notValidSignIn}
        <label>Username:
        <input type='text'
            onChange={(event) => setSignInName(event.target.value.trim())}
          /></label>
        <label>Password:
        <input type='text'
            onChange={(event) => setSignInPW(event.target.value.trim())}
          /></label>
        <button onClick={signIn} >Sign In</button>
      </div>
    </div>
  );
}

export default SignUpIn;