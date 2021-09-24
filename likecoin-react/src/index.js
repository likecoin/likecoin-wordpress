import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";

// for wordpress to show
const reactAppData = window.rpReactPlugin || {};
const { appSelector } = reactAppData;
const appAnchorElement = document.querySelector(appSelector);
if (appAnchorElement) {
  ReactDOM.render(
  <Router>
    <App />
  </Router>, appAnchorElement);
}

// for npm run start development
// const root = document.querySelector('#root');
// if (root) {
//   ReactDOM.render(
//     <Router>
//       <App />
//     </Router>,
//     root
//   );
// }
