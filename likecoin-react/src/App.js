import "./App.css";
import MainSettings from "./pages/MainSettings";
import Submenu1 from "./pages/Submenu1";
import { Route, Switch } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <MainSettings />
        </Route>
        <Route path="/submenu1" exact>
          <Submenu1 />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
