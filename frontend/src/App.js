import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Signin from './Signin';
import Verify from './Verify';

function App() {
  const route = (
    <Switch>
      <Route path="/signin" component={Signin} />
      <Route path="/verify" component={Verify} />
      <Route path="/" component={Home} />
    </Switch>
  );
  return <BrowserRouter>{route}</BrowserRouter>;
}

export default App;
