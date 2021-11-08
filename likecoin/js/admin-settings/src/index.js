import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { SiteLikerInfoProvider } from './context/site-likerInfo-context';
import { UserLikerInfoProvider } from './context/user-likerInfo-context';

// for wordpress to show
const reactAppData = window.likecoinReactAppData || {};
const { appSelector } = reactAppData;
const appAnchorElement = document.querySelector(appSelector);
if (appAnchorElement) {
  ReactDOM.render(
    <Router>
      <SiteLikerInfoProvider>
        <UserLikerInfoProvider>
              <App />
        </UserLikerInfoProvider>
      </SiteLikerInfoProvider>
    </Router>,
    appAnchorElement,
  );
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
