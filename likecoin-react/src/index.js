import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";

const reactAppData = window.rpReactPlugin || {};
const { appSelector } = reactAppData;
console.log(appSelector);
const appAnchorElement = document.querySelector(appSelector);
if (appAnchorElement) {
  ReactDOM.render(
  <Router>
    <App />
  </Router>, appAnchorElement);
}
