import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';

// for wordpress to show
const reactAppData = window.likecoinReactAppData || {};
const { appSelector } = reactAppData;
const appAnchorElement = document.querySelector(appSelector);
if (appAnchorElement) {
  ReactDOM.render(
    <Router>
      <App />
    </Router>,
    appAnchorElement,
  );
} else {
  const root = document.querySelector('#root');
  window.wpApiSettings = window.wpApiSettings || {};
  if (root) {
    ReactDOM.render(
      <Router>
        <App />
      </Router>,
      root,
    );
  }
}
