import './App.css';
import MainSettingsPage from './pages/MainSettingsPage';
import LikecoinButtonPage from './pages/LikecoinButtonPage';
import { Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <MainSettingsPage />
        </Route>
        <Route path="/likecoin-button" exact>
          <LikecoinButtonPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
