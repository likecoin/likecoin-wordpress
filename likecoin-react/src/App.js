import './App.css';
import MainSettingPage from './pages/MainSettingPage';
import LikecoinButtonPage from './pages/LikecoinButtonPage';
import PublishSettingPage from './pages/PublishSettingPage';
import { Route, Switch } from 'react-router-dom';

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
      </Switch>
    </div>
  );
}

export default App;
