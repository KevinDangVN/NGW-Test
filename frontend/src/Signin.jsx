import axios from 'axios';
import React, { useEffect } from 'react';
import GoogleLogin from 'react-google-login';

const Signin = () => {
  const responseGoogle = (response) => {
    console.log(response);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="http://localhost:1337/auth/google"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign in with google
        </a>
        <a
          className="App-link"
          href="http://localhost:1337/auth/facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign in with facebook
        </a>
        <GoogleLogin
          clientId="400400446699-kr352th4j9gr9lnj5tucc761qmb4a3av.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      </header>
    </div>
  );
};

export default Signin;
