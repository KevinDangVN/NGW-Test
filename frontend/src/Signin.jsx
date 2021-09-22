import React from 'react';

const Signin = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="http://localhost:4000/auth/google"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign in with google
        </a>
        <a
          className="App-link"
          href="http://localhost:4000/auth/facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign in with facebook
        </a>
      </header>
    </div>
  );
};

export default Signin;
