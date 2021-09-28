import "./App.css";
import MainSettings from "./pages/MainSettings";
import LikecoinButton from "./pages/LikecoinButton";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Switch>
          <Route path="/" exact>
            <MainSettings />
          </Route>
          <Route path="/likecoin-button" exact>
            <LikecoinButton />
          </Route>
        </Switch>
    </div>
  );
}

export default App;
