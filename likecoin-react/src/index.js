import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const reactAppData = window.rpReactPlugin || {};
const { appSelector } = reactAppData;
console.log(appSelector);
const appAnchorElement = document.querySelector(appSelector);
if (appAnchorElement) {
  ReactDOM.render(<App />, appAnchorElement);
}
