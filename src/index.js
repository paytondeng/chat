import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './app';
import * as serviceWorker from './core/serviceWorker';
import { Provider } from 'react-redux';
import chatApp from './reducers/index';
import { createStore } from 'redux';

const store = createStore(chatApp);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
