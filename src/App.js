import React from 'react';
import './app.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Login from './pages/login/login';
import Chat from './pages/chat/chat';
import Register from './pages/register/register';
import Home from './pages/home/home';

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/chat" component={Chat}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/register" component={Register}></Route>
          <Route exact path="/" component={Home}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
