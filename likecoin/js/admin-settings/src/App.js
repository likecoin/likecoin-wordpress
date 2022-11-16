import './App.css';
import { Route, Switch } from 'react-router-dom';
import MainSettingPage from './pages/MainSettingPage';
import LikecoinButtonPage from './pages/LikecoinButtonPage';
import PublishSettingPage from './pages/PublishSettingPage';
import SponsorLikecoinPage from './pages/SponsorLikecoinPage';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <MainSettingPage />
        </Route>
        <Route path="/likecoin-button" exact>
          <LikecoinButtonPage />
        </Route>
        <Route path="/publish-setting" exact>
          <PublishSettingPage />
        </Route>
        <Route path="/sponsor-likecoin" exact>
          <SponsorLikecoinPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
